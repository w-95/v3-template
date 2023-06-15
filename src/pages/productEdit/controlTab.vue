<template>
    <el-form ref="controlFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="control-ruleForm table-box"
        label-suffix="：" inline-message v-loading="loading">
        <el-form-item label="产品名称" :show-overflow-tooltip=true class="control-form-item">
            {{productName}} (编号：{{productCode}}，状态：{{robotStatus}})
        </el-form-item>

        <el-form-item label="位置" :show-overflow-tooltip=true v-show="coordMsg && rosMsg" class="control-form-item">
            {{coordMsg}}({{rosMsg}})
        </el-form-item>

        <el-form-item label="控制类型" :rules="rules.controlType" prop="controlType" class="control-form-item">
            <el-radio-group v-model="ruleForm.controlType" size="small">
                <el-radio v-for="radio in controlTypes" :label="radio.label" :value="radio.value" :key="radio.label" size="large" class="control-radio">{{ radio.name }}</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="adb开关" :rules="rules.adbSwitch" prop="adbSwitch" :class="['control-form-item animate__animated', isShowAbd ? 'animate__fadeInLeft': 'animate__fadeOut']" v-if="isShowAbd">
            <el-radio-group v-model="ruleForm.adbSwitch" size="large">
                <el-radio label="0" :value="0" >打开网络adb</el-radio>
                <el-radio label="1" :value="1">关闭网络adb</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="选择日期" :rules="rules.dateRange" prop="dateRange" v-if="isShowDateRange" :class="['control-form-item animate__animated', isShowDateRange ? 'animate__fadeInLeft': 'animate__fadeOut']">
            <el-date-picker
                v-model="ruleForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="large"
            />
        </el-form-item>

        <el-form-item label="脚本内容" :rules="rules.scriptContent" prop="scriptContent" v-if="isShowScriptContent" :class="['control-form-item animate__animated', isShowScriptContent ? 'animate__fadeInLeft': 'animate__fadeOut']">
            <el-input type="textarea" style="width: 540px" v-model="ruleForm.scriptContent" placeholder="请输入发送给机器人的脚本内容" ref="scriptContent"></el-input>
        </el-form-item>

        <el-form-item label="文件/目录" :rules="rules.scriptContent" prop="scriptContent" v-if="idShowFileD" :class="['control-form-item animate__animated', idShowFileD ? 'animate__fadeInLeft': 'animate__fadeOut']">
            <el-input type="textarea" style="width: 540px" v-model="ruleForm.scriptContent" placeholder="请输入机器人端的文件/目录地址" ref="scriptContent"></el-input>
        </el-form-item>

        <el-form-item class="control-form-item">
            <div id="logResultDiv" style="color:#409eff; white-space:pre-wrap; line-height:20px"></div>
            <div id="downLoadDiv" style="display:none">
                <el-button class="download-btn" style="width: 220px;">
                   <a id="hrefDownLoad" target="_blank" href="" download="" class="download">下载</a>
                </el-button>
            </div>
        </el-form-item>

        <el-form-item class="control-form-item">
            <div id="sendToRobotDiv">
                <el-button type="primary" plain size="large" :style="style"  @click="sendRemoteControl()">保存</el-button>
                <el-button type="primary" plain size="large" :style="style" v-if="idShowDownLoadMapBtn" @click="downloadMap">
                    下载机器人地图
                </el-button>
            </div>
        </el-form-item>

    </el-form>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { FormInstance } from 'element-plus/lib/components/form/index.js';

import { useWebSocket } from '@vueuse/core';

import { useControlTab } from "./controlTabForm";

import { controlType as controlTypes } from "@/data";

import { px2vw, createAtag_Downlod, getSocketOrg } from '@/utils';
import { ElMessage } from 'element-plus/lib/components/index.js';

const props = defineProps({
    memberId: {
        type: Number,
        default: -1
    }
});

const [ route ] = [useRoute(), useRouter()];

const { productId } = route.query;

const controlFormRef = ref(null);

const controlFormData = useControlTab(productId || '', props.memberId);
const { productName, productCode, robotStatus, coordMsg, rosMsg, rules, loading, ruleForm, controlType, productLocationId, productTypeId } = controlFormData;

const isShowDateRange = computed(() => controlType.value === 1);
const isShowScriptContent = computed(() => controlType.value === 2);
const isShowAbd = computed(() => controlType.value === 3);
const idShowFileD = computed(() => controlType.value === 5);
const idShowDownLoadMapBtn = computed(() => {
    return (productTypeId.value === 4 && productLocationId.value != null && productLocationId.value != 0)
})

const style = `width: ${px2vw(220)}`;

// 提交表单
const sendRemoteControl = () => {
    if (controlFormRef.value) {
        (controlFormRef.value as FormInstance).validate(async (valid: boolean) => {
            if (valid) {
                const socketUri = getSocketOrg();
                let msgInstance: any = null;
                const { ws, close } = useWebSocket(socketUri + '/websocket/productId_' + productId, {
                    autoReconnect: {
                        retries: 10,
                        delay: 1000,
                        onFailed() {
                            ElMessage.error('重连失败, 超出最大重连次数!');
                            setTimeout(() => close(), 2000);
                        },
                    },
                    heartbeat: {
                        message: 'ping',
                        interval: 1000,
                        pongTimeout: 1000,
                    },
                });

                if(ws?.value?.onopen) {
                    ws.value.onopen = () => {
                        if(msgInstance) msgInstance.close();
                        msgInstance = null;
                        ElMessage.success("连接成功");
                    }
                };

                if(ws.value?.onclose) {
                    ws.value.onclose = () => {
                        ElMessage.info("连接已关闭")
                    }
                }

                if(ws.value?.onerror) {
                    ws.value.onerror = () => {
                        msgInstance = ElMessage({
                            type: 'warning',
                            message: "正在加速重连中...",
                            duration: 0
                        })
                    }
                };
            }
        })
    }
};

// 下载机器人地图
const downloadMap = () => {
    const url = import.meta.env.VITE_API_BASEURL + '/product/downloadMapForWeb';
    createAtag_Downlod(url, { id: productId }, `${url}?id=${productId}`).click();
}

</script>
<style scoped lang="scss">
.control-ruleForm{
    width: 800px;
}
.control-radio{
    width: 20%;
}
.control-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
</style>
