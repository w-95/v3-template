import { ref, onMounted, Ref, reactive } from 'vue';
import { useWebSocket } from '@vueuse/core';
import { ElMessage } from 'element-plus/lib/components/index.js';

import { FoxgloveClient } from '@foxglove/ws-protocol';

import { parseChannel } from '@/foxglove/parser';

import * as base64 from '@protobufjs/base64';

import protobufjs from 'protobufjs';
import { getMapBase64 } from "@/utils/index";
import { TopicMapT, TopicScanT } from "@/interface/foxgloveThree";

import { MessageDefinitionField, MessageDefinition } from '@foxglove/message-definition';

type ParsedChannel = {
  deserialize: (data: ArrayBufferView) => unknown;
  datatypes: Map<string, MessageDefinition>;
};

type ResolvedChannel = {
  channel: {
    id: number;
    topic: string;
    encoding: string;
    schemaName: string;
    schema: string;
    schemaEncoding?: string;
  };
  parsedChannel: ParsedChannel;
};

type OptionT = {
  mapDataChange: (data: TopicMapT) => void;
  scanDataChange: (data: TopicScanT) => void;
}
export const useFoxgloveSocket = (linkUrl: string, rosNumber: string, options: OptionT) => {
  const msgInstance: Ref<any> = ref(null);
  let client: Ref<any> = ref(null);
  const channelsByTopic: any = ref(new Map<string, ResolvedChannel>());
  const channelsById: any = ref(new Map<number, ResolvedChannel>());
  const receivedBytes = ref(0);

  const socket: any = useWebSocket(linkUrl, {
    autoReconnect: {
      retries: 10,
      delay: 1000,
      onFailed() {
        ElMessage.error('重连失败, 超出最大重连次数!');
        setTimeout(() => close(), 2000);
      },
    },
  });

  const { ws } = socket;

  client.value = new FoxgloveClient({ ws: ws.value });

  // socket
  if (ws?.value?.onopen) {
    ws.value.onopen = () => {
      if (msgInstance.value) msgInstance.value.close();
      msgInstance.value = null;
      ElMessage.success('连接成功');
    };
  }

  if (ws.value?.onclose) {
    ws.value.onclose = () => {
      ElMessage.info('连接已关闭');
    };
  }

  if (ws.value?.onerror) {
    ws.value.onerror = () => {
      msgInstance.value = ElMessage({
        type: 'warning',
        message: '正在加速重连中...',
        duration: 0,
      });
    };
  }

  // client
  client.value.on('open', () => {
    console.log('client on :::open event');
  });

  client.value.on('error', (err: any) => {
    console.log('client on :::error event', err);
  });

  client.value.on('close', () => {
    console.log('client on :::close event');
  });

  client.value.on('serverInfo', (event: Event) => {
    console.log('client on :::serverInfo', event);
  });

  client.value.on('status', (event: Event) => {
    console.log('client on :::status event', event);
  });

  // 通知服务器关于可用的客户端通道。注意，只有当服务器先前声明它具有clientPublish功能时，才允许客户端发布通道
  client.value.on('advertise', (newChannels: any) => {
    console.log('client on :::advertise event', newChannels);
    if (!Array.isArray(newChannels)) {
      return;
    }

    newChannels.forEach((channel) => {
      /**
       * /map 地图数据
       * /scan 扫描数据
       * /tf 点位实时数据
       */

      let parsedChannel;
      try {
        const { encoding, schemaEncoding } = channel;

        if (
          encoding === 'protobuf' &&
          (schemaEncoding == undefined || schemaEncoding === 'protobuf')
        ) {
          const schemaData = new Uint8Array(base64.length(channel.schema));
          if (base64.decode(channel.schema, schemaData, 0) !== schemaData.byteLength) {
            throw new Error(`Failed to decode base64 schema on channel ${channel.id}`);
          };

          parsedChannel = parseChannel({
            messageEncoding: channel.encoding,
            schema: {
              name: channel.schemaName,
              encoding: 'protobuf',
              data: schemaData,
            },
          });
        }
      } catch (error) {
        console.log("error：：：：：：：：", error)
      };

      channelsById.value.set(channel.id, { channel, parsedChannel });
      channelsByTopic.value.set(channel.topic, { channel, parsedChannel });

      client.value.subscribe(channel.id);
    });
    console.log('this is a channelsByTopic.value =====', channelsByTopic.value);
  });

  client.value.on('unadvertise', (removedChannels: any) => {
    console.log('client on :::unadvertise event', removedChannels);
  });

  client.value.on('message', ({ subscriptionId, data }: any) => {
    // console.log('client on :::message event', subscriptionId, data);
    // receivedBytes.value += data.byteLength;

    // /scan=1  /map=2  /move_base/GlobalPlanner/plan=3  /tf=4  /wayPoint=5
    const topicChanInfo = channelsById.value.get(subscriptionId + 1);

    if (topicChanInfo) {
      const message = topicChanInfo.parsedChannel.deserialize(data);
      
      // 地图数据
      if( subscriptionId === 1 && message) {
        const mapData = message.data;
        const mapData64 = getMapBase64(mapData, message.info.width, message.info.height);
        console.log('地图::', message, mapData64);
        options.mapDataChange(message);
        return;
      };

      // 激光雷达扫描数据
      if( subscriptionId === 0 && message) {
        console.log("激光雷达扫描::", message);
        options.scanDataChange(message);
      }
    }
  });

  client.value.on('time', (params: any) => {
    console.log('client on :::time event', params);
  });

  client.value.on('parameterValues', (params: any) => {
    console.log('client on :::parameterValues event', params);
  });

  client.value.on('advertiseServices', (services: any) => {
    console.log('client on :::advertiseServices event', services);
  });

  client.value.on('unadvertiseServices', (serviceIds: any) => {
    console.log('client on :::unadvertiseServices event', serviceIds);
  });

  client.value.on('serviceCallResponse', (response: any) => {
    console.log('client on :::serviceCallResponse event', response);
  });

  client.value.on('connectionGraphUpdate', (event: Event) => {
    console.log('client on :::connectionGraphUpdate event');
  });

  type Channel = {
    messageEncoding: string;
    schema: { name: string; encoding: string; data: Uint8Array } | undefined;
  };

  return { client };
};
