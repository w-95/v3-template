<template>
  <el-form ref="formRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm table-box"
    label-suffix="：" inline-message v-loading="loading">
    <el-form-item label="产品名称" prop="productName" class="poredit-form-item">
      <el-input v-model="ruleForm.productName" placeholder="请输入产品名称" size="large" />
    </el-form-item>

    <el-form-item label="提醒电量值" prop="remindChargeValue" class="poredit-form-item">
      <el-radio-group v-model="ruleForm.remindChargeValue">
        <el-radio v-for="(radio, index) in remindRadios" :key="index" :label="radio.label" :value="radio.value"
          size="large">{{
            radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="回充电量值" prop="chargeValue" class="poredit-form-item">
      <el-radio-group v-model="ruleForm.chargeValue">
        <el-radio v-for="(radio, index) in chargeRadios" :key="index" :label="radio.label" :value="radio.value">{{
          radio.name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="产品编号" prop="productCode" class="poredit-form-item">
      <el-input v-model="ruleForm.productCode" disabled placeholder="请输入产品名称" size="large" />
    </el-form-item>

    <el-form-item label="出库" prop="businessName" class="poredit-form-item">
      <el-checkbox label="已交付客户" name="type" size="large" class="ck-checkbox" v-model="isShowBusinessIpt" />
      <el-select v-model="ruleForm.businessName" v-show="isShowBusinessIpt" filterable placeholder="Select" size="large">
        <el-option v-for="item in clientNames" :key="item.id" :label="item.businessName" value-key="businessName"
          :value="item"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="选择梯控" prop="businessName" class="poredit-form-item">
      <el-select v-model="ruleForm.elevatorIds" multiple filterable allow-create default-first-option
        :reserve-keyword="false" placeholder="请选择" size="large">
        <el-option v-for="(deviceData) in deviceList" :key="deviceData.id" :value="deviceData.id"
          :label="deviceData.deviceName"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="停用机器人" prop="enabledState" class="poredit-form-item">
      <el-checkbox label="停用机器人" v-model="ruleForm.enabledState" size="large" />
    </el-form-item>

    <el-form-item label="" prop="" class="poredit-form-item">
      <el-button type="primary" plain size="large" :style="style" @click="editSubmitProduct">保存</el-button>
      <el-button type="primary" plain size="large" :style="style" @click="delAllDataToInit">恢复出厂设置</el-button>
      <el-button type="primary" plain size="large" @click="delProduct">删除</el-button>
    </el-form-item>

  </el-form>
</template>

<script lang="ts">
import {ref} from 'vue';
import { useRoute, useRouter } from "vue-router";

import { ElMessage, ElMessageBox } from 'element-plus/lib/components/index.js';

import { editProduct, factoryReset, removeProduct } from "@/request/product";

import { px2vw } from "@/utils/index";
import { FormInstance } from 'element-plus/lib/components/form/index.js';
import { useAttrForm } from "./useAttrTab";

export default ({
  setup() {
    const formRef = ref(null);

    const style = `marginRight: ${px2vw(20)} `;

    const [route, router] = [useRoute(), useRouter()];

    const { productId } = route.query;

    const attrFormState = useAttrForm(productId || '');

    const { isShowBusinessIpt, ruleForm } = attrFormState;

    // 提交表单
    const editSubmitProduct = () => 
    {
      if (formRef.value) {
        (formRef.value as FormInstance).validate(async (valid: boolean) => {
          if (valid) {
            const { elevatorIds, enabledState, productCode, ...formData } = ruleForm.value;

            const params = {
              id: productId || -1,
              elevatorIds: JSON.stringify(elevatorIds),
              enabledState: enabledState ? 0 : 1,
              state: Number(isShowBusinessIpt.value),
              ...formData
            };

            const { status, data } = await editProduct(params);

            if (status === 0 && data) {
              ElMessage.success("提交成功!")
            }
          }
        })
      }
    };

    // 恢复出厂设置
    const delAllDataToInit = () => 
    {
      ElMessageBox.confirm(
        '【恢复出厂设置】将会清理所有数据，包括：机器人用户、地图、任务等。是否继续操作?',
        '特别警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { status } = await factoryReset({ productId: productId || '' });
          if (status === 0) {
            ElMessage.success("操作成功!")
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '操作失败!',
          })
        })
    };

    const delProduct = () => 
    {
      ElMessageBox.confirm(
        '【删除机器人后不可恢复】，请慎重操作。是否继续?',
        '特别警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then( async () => {
          const { status } = await removeProduct({productId: productId || ''});
          if( status === 0 ) {
            ElMessage({
              type: 'success',
              message: '删除成功!',
              onClose: () => router.push({ name: 'ProdList' })
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '操作失败!',
          })
        })
    };

    return {
      ...attrFormState,
      style,
      editSubmitProduct,
      formRef,
      delAllDataToInit,
      delProduct
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
}

.poredit-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

:deep(.poredit-form-item .el-form-item__content) {
  flex: 1;
  display: flex;
}

:deep(.poredit-form-item .el-form-item__content .el-radio-group) {
  width: 100%;
  justify-content: space-between;
}

:deep(.poredit-form-item .el-form-item__content .el-select) {
  flex: 1;
  justify-content: space-around;
}
</style>