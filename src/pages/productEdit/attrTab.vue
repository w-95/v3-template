<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm table-box"
    label-suffix="：" inline-message v-loading="loading">
    <el-form-item label="产品名称" prop="productName">
      <el-input v-model="ruleForm.productName" placeholder="请输入产品名称" size="large" />
    </el-form-item>

    <el-form-item label="提醒电量值" prop="remindChargeValue">
      <el-radio-group v-model="ruleForm.remindChargeValue">
        <el-radio v-for="(radio, index) in remindRadios" :key="index" :label="radio.label" :value="radio.value"
          size="large">{{
            radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="回充电量值" prop="chargeValue">
      <el-radio-group v-model="ruleForm.chargeValue">
        <el-radio v-for="(radio, index) in chargeRadios" :key="index" :label="radio.label" :value="radio.value">{{
          radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="产品编号" prop="productCode">
      <el-input v-model="ruleForm.productCode" disabled placeholder="请输入产品名称" size="large" />
    </el-form-item>

    <el-form-item label="出库" prop="businessName">
      <el-checkbox label="已交付客户" name="type" size="large" class="ck-checkbox" v-model="isShowBusinessIpt" />
      <el-select v-model="ruleForm.businessName" v-show="isShowBusinessIpt" filterable placeholder="Select">
        <el-option v-for="item in clientNames" :key="item.id" :label="item.businessName" value-key="businessName" :value="item"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="选择梯控" prop="businessName">
      <el-select v-model="ruleForm.businessName" multiple filterable allow-create default-first-option
        :reserve-keyword="false" placeholder="请选择">
        <el-option v-for="(deviceData) in deviceList" :key="deviceData.id" :value="deviceData.id" :label="deviceData.deviceName" ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="停用机器人" prop="enabledState">
      <el-checkbox-group v-model="ruleForm.enabledState">
        <el-checkbox label="停用机器人" name="type" size="large" />
      </el-checkbox-group>
    </el-form-item>

  </el-form>
</template>

<script lang="ts">
import { reactive, onMounted, ref, Ref, toRefs } from 'vue';
import { useRoute } from "vue-router";

import { ElMessage } from 'element-plus/lib/components/index.js';

import { batteryTips, batteryTipsT_5, rechargeValue, rechargeValueT_5 } from "@/data";

import { getProductInfo } from "@/request/product";
import { getBusinessAll } from "@/request/client.ts";
import { getDeviceList } from '@/request/device.ts';

import { useGlobalStore } from '@/store/global';

import { productTypeIdT } from "@/interface/enum";

export default ({
  setup() {
    const state = reactive({
      ruleForm: {
        productName: '',          // 产品名称
        remindChargeValue: 10,    // 提醒电量值
        chargeValue: 10,          // 回充电量值
        productCode: '',          // 产品编号
        businessName: '',         // 交付客户
        elevatorIds: '',          // 选择梯控
        enabledState: false       // 机器人停用
      },

      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 12, message: '产品名称长度为3-12个字符', trigger: 'blur' },
        ],
        remindChargeValue: [
          { required: true, message: '请至少选择一项', trigger: 'blur' },
        ],
        chargeValue: [
          { required: true, message: '请至少选择一项', trigger: 'blur' },
        ]
      }
    });

    // 提醒电量数组
    let remindRadios: Ref<typeof batteryTips> = ref([]);
    // 回充电量数组
    const chargeRadios: Ref<typeof rechargeValue> = ref([]);
    // 客户名称列表
    const clientNames: any = ref([]);
    // 设备列表
    const deviceList: any = ref([]);
    // 是否可选择交付客户
    const isShowBusinessIpt = ref(false);
    // 是否显示loading
    const loading = ref(true);

    const route = useRoute();
    const globalStore = useGlobalStore();

    onMounted(async () => {
      const { productId } = route.query;
      const memberId = globalStore.userInfo?.id;

      // 如果有产品id就获取该产品信息
      if (productId && memberId!!) {
        

        const requests = [
          await getProductInfo({ id: productId, productId, memberId }),
          await getBusinessAll({ memberId }),
          await getDeviceList()
        ];

        try {
          const [
            { status: productStatus, data: productData }, 
            { status: clientStatus, data: clientData }, 
            { status: deviceStatus, data: deviceData}
          ] = await Promise.all(requests);
          
          // 初始化form默认值
          if(productStatus === 0) {
            const { productName, productCode, productType, productTypeId, remindChargeValue } = productData;
            const { chargeValue, businessName, elevatorIds, enabledState, state: productState } = productData;

            state.ruleForm.productName = productName;
            state.ruleForm.productCode = productCode + '【类型：' + productType + '】';
            state.ruleForm.remindChargeValue = getRemindChargeValue(productTypeId, remindChargeValue);
            state.ruleForm.chargeValue = getChargeValue(productTypeId, chargeValue);
            state.ruleForm.businessName = businessName;
            state.ruleForm.elevatorIds = elevatorIds;
            state.ruleForm.enabledState = enabledState === 0 ? true : false;

            remindRadios.value = productType === productTypeIdT.deliveryRobot ? batteryTips : batteryTipsT_5;
            chargeRadios.value = productType === productTypeIdT.deliveryRobot ? rechargeValue : rechargeValueT_5;
            isShowBusinessIpt.value = productState === 1 ? true : false;
          };

          // 初始化客户名称列表
          if( clientStatus === 0) {
            clientNames.value = clientData;
          };

          // 初始化设备列表
          if( deviceStatus === 0) {
            deviceList.value = deviceData;
          };

          if(productStatus !== 0 || clientStatus !== 0 && deviceStatus !== 0) {
            const msg = productStatus !== 0 ? '产品' : clientStatus !== 0 ? '客户': '设备';
            ElMessage.error(`获取${msg}信息异常!`);
          };
          
          loading.value = false;

        } catch (error) {
          ElMessage.error("获取信息异常!");
          loading.value = false;
        };
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
        return 25
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
  },
})
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  width: 800px;
}

.ck-checkbox {
  margin-right: 24px;
}</style>