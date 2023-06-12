<template>
  {{ productName }}
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="产品名称" prop="productName">
      <el-input v-model="productName" placeholder="请输入产品名称" />
    </el-form-item>

    <el-form-item label="提醒电量值" prop="remindChargeValue">
      <el-radio-group v-model="remindChargeValue">
        <el-radio v-for="(radio, index) in remindRadios" :key="index" :label="radio.label" :value="radio.value">{{ radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="回充电量值" prop="chargeValue">
      <el-radio-group v-model="chargeValue">
        <el-radio v-for="(radio, index) in chargeRadios" :key="index" :label="radio.label" :value="radio.value">{{ radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="产品编号" prop="productName">
      <el-input v-model="productCode" disabled placeholder="请输入产品名称" />
    </el-form-item>

    <el-form-item label="停用机器人" prop="enabledState">
      <el-checkbox-group v-model="enabledState">
        <el-checkbox label="停用机器人" name="type" />
      </el-checkbox-group>
    </el-form-item>

    <!-- <el-form-item label="出库" prop="remindChargeValue">
      <el-select v-model="ruleForm.remindChargeValue" >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item> -->

  </el-form>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, Ref, toRefs } from 'vue';
import { useRoute } from "vue-router";

import { ElMessage } from 'element-plus/lib/components/index.js';

import { batteryTips, batteryTipsT_5, rechargeValue, rechargeValueT_5 } from "@/data";
import { getProductInfo } from "@/request/product";
import { useGlobalStore } from '@/store/global';
import { productTypeIdT } from "@/interface/enum";

const route = useRoute();
const globalStore = useGlobalStore();

let ruleForm: any = reactive({
  productName: '',          // 产品名称
  remindChargeValue: '',    // 提醒电量值
  chargeValue: '',          // 回充电量值
  productCode: '',          // 产品编号
  businessName: '',         // 交付客户
  elevatorIds: '',          // 选择梯控
  enabledState: false       // 机器人停用
});

const rules = reactive({
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
});

const remindRadios: Ref<typeof batteryTips> = ref([]);
const chargeRadios: Ref<typeof rechargeValue> = ref([]);


ruleForm = toRefs(ruleForm);

const { productName, remindChargeValue, chargeValue, productCode, businessName, elevatorIds, enabledState } = ruleForm;

onMounted( async () => 
{
  const { productId } = route.query;

  // 如果有产品id就获取该产品信息
  if(productId) 
  {
    const { status, data } = await getProductInfo({ id: productId, productId, memberId: globalStore.userInfo?.id || 0 });
    if( status === 0 && data ) 
    {
      const { productName, productCode, productType, productTypeId, remindChargeValue } = data;
      const { chargeValue, businessName, elevatorIds, enabledState } = data;

      // 初始化默认值
      productName.value = productName;
      productCode.value = productCode + '【类型：'+ productType + '】';
      remindChargeValue.value = getRemindChargeValue(productTypeId, remindChargeValue);
      chargeValue.value = getChargeValue(productTypeId, chargeValue);
      businessName.value = businessName;
      elevatorIds.value = elevatorIds;
      enabledState.value = enabledState === 0? true: false;

      remindRadios.value = productType === productTypeIdT.deliveryRobot? batteryTips: batteryTipsT_5;
      chargeRadios.value = productType === productTypeIdT.deliveryRobot? rechargeValue: rechargeValueT_5;

      console.log(remindRadios.value);
      console.log(chargeRadios.value);
      return;
    };

    ElMessage.error("获取产品信息异常!");
    return;
  }
});

/**
 * 获取提醒电量值
 * @param productTypeId 产品的类型 底盘、配送、消毒、服务 productTypeIdT
 * @param remindChargeValue 提醒电量的值
 * @returns string 电量值
 */
 const getRemindChargeValue = (productTypeId: productTypeIdT, remindChargeValue: number | undefined): string => 
{
  if( remindChargeValue ) return remindChargeValue.toString();
  if(productTypeId === productTypeIdT.deliveryRobot) {
    return '25'
  };
  return '15';
};

/**
 * 获取回充电量值
 * @param productTypeId 产品的类型 底盘、配送、消毒、服务 productTypeIdT
 * @param chargeValue 回充电量的值
 * @returns stirng 电量值
 */
const getChargeValue = (productTypeId: productTypeIdT, chargeValue: number | undefined): string => 
{
  if( chargeValue ) return chargeValue.toString();
  if(productTypeId === productTypeIdT.deliveryRobot) {
    return '20'
  };
  return '10';
}
</script>

<style lang="scss" scoped></style>