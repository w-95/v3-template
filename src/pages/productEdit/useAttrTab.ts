import { reactive, onMounted, ref, Ref, toRefs } from 'vue';

import { ElMessage } from 'element-plus/lib/components/index.js';

import { batteryTips, batteryTipsT_5, rechargeValue, rechargeValueT_5 } from '@/data';

import { getProductInfo } from '@/request/product';
import { getBusinessAll } from '@/request/client.ts';
import { getDeviceList } from '@/request/device.ts';

import { useGlobalStore } from '@/store/global';

import { productTypeIdT } from '@/interface/enum';

export const useAttrForm = (productId: string) => {
  const state = reactive({
    ruleForm: {
      productName: '', // 产品名称
      remindChargeValue: 10, // 提醒电量值
      chargeValue: 10, // 回充电量值
      productCode: '', // 产品编号
      businessName: '', // 交付客户
      elevatorIds: [], // 选择梯控
      enabledState: false, // 机器人停用
      businessId: -1,
    },

    rules: {
      productName: [
        { required: true, message: '请输入产品名称', trigger: 'blur' },
        { min: 1, max: 12, message: '产品名称长度为3-12个字符', trigger: 'blur' },
      ],
      remindChargeValue: [{ required: true, message: '请至少选择一项', trigger: 'blur' }],
      chargeValue: [{ required: true, message: '请至少选择一项', trigger: 'blur' }],
    },
  });

  // 提醒电量数组
  let remindRadios: Ref<typeof batteryTips> = ref([]);
  // 回充电量数组
  const chargeRadios: Ref<typeof rechargeValue> = ref([]);
  // 是否可选择交付客户
  const isShowBusinessIpt = ref(false);
  // 客户名称列表
  const clientNames: any = ref([]);
  // 设备列表
  const deviceList: any = ref([]);
  // 是否显示loading
  const loading = ref(true);

  const globalStore = useGlobalStore();

  onMounted(async () => {
    const memberId = globalStore.userInfo?.id;

    // 如果有产品id就获取该产品信息
    if (productId && memberId!!) {
      const requests = [
        await getProductInfo({ id: productId, productId, memberId }),
        await getBusinessAll({ memberId }),
        await getDeviceList(),
      ];

      try {
        const [
          { status: productStatus, data: productData },
          { status: clientStatus, data: clientData },
          { status: deviceStatus, data: deviceData },
        ] = await Promise.all(requests);

        // 初始化form默认值
        if (productStatus === 0) {
          const { productName, productCode, productType, productTypeId, remindChargeValue, businessId } = productData;

          const { chargeValue, businessName, elevatorIds, enabledState, state: productState } = productData;

          state.ruleForm.productName = productName;
          state.ruleForm.productCode = productCode + '【类型：' + productType + '】';
          state.ruleForm.remindChargeValue = getRemindChargeValue(productTypeId, remindChargeValue);
          state.ruleForm.chargeValue = getChargeValue(productTypeId, chargeValue);
          state.ruleForm.businessName = businessName;
          state.ruleForm.elevatorIds = elevatorIds;
          //enabledState: 0标识停用，否则为启用状态
          state.ruleForm.enabledState = enabledState === 0 ? true : false;
          state.ruleForm.businessId = businessId;

          remindRadios.value = productTypeId === productTypeIdT.deliveryRobot ? batteryTips : batteryTipsT_5;
          chargeRadios.value = productTypeId === productTypeIdT.deliveryRobot ? rechargeValue : rechargeValueT_5;
          //enabledState: 0标识停用，否则为启用状态
          isShowBusinessIpt.value = productState === 1 ? true : false;
        }

        // 初始化客户名称列表
        if (clientStatus === 0) {
          clientNames.value = clientData;
        }

        // 初始化设备列表
        if (deviceStatus === 0) {
          deviceList.value = deviceData;
        }

        if (productStatus !== 0 || (clientStatus !== 0 && deviceStatus !== 0)) {
          const msg = productStatus !== 0 ? '产品' : clientStatus !== 0 ? '客户' : '设备';
          ElMessage.error(`获取${msg}信息异常!`);
        }

        loading.value = false;
      } catch (error) {
        ElMessage.error('获取信息异常!');
        loading.value = false;
      }
    }
  });

  /**
     * 获取提醒电量值
     * @param productTypeId 产品的类型 底盘、配送、消毒、服务 productTypeIdT
     * @param remindChargeValue 提醒电量的值
     * @returns string 电量值
     */
  const getRemindChargeValue = (productTypeId: productTypeIdT, remindChargeValue: number | undefined): number => {
    if (remindChargeValue) return remindChargeValue;
    if (productTypeId === productTypeIdT.deliveryRobot) {
      return 25;
    };
    return 15;
  };

  /**
   * 获取回充电量值
   * @param productTypeId 产品的类型 底盘、配送、消毒、服务 productTypeIdT
   * @param chargeValue 回充电量的值
   * @returns stirng 电量值
   */
  const getChargeValue = (productTypeId: productTypeIdT, chargeValue: number | undefined): number => {
    if (chargeValue) return chargeValue;
    if (productTypeId === productTypeIdT.deliveryRobot) {
      return 20
    };
    return 10;
  };

  return {
    ...toRefs(state),
    remindRadios,
    chargeRadios,
    isShowBusinessIpt,
    loading,
    clientNames,
    deviceList
  }
};
