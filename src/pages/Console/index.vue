<template>
  <div class="console-box">
    <!-- 头部card 4 -->
    <div class="header-card-box">
      <el-card class="item-card" v-for="(card, index) in cards" :key="index">
        <HeaderCard v-bind="{ ...card }"></HeaderCard>
      </el-card>
    </div>

    <!-- 底部图表 -->
    <div class="footer-card-box">

      <!-- 左侧图表 -->
      <el-card class="chart-card">
        <div :id="chartIdName.disinfectChartId"></div>
      </el-card>

      <!-- 右侧图表 -->
      <el-card class="chart-card">

        <div :id="chartIdName.deliveryCharId"></div>

        <div class="toolbox" v-if="showTool">
          <el-select size="small" v-model="deliveryPickerSele" placeholder="请选择" class="select-tool" @change="seleChange">
            <el-option v-for="(item) in deliveryReportTime" :key="item.label" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-button size="small" type="primary" @click="setShowDialog">导出报表</el-button>
        </div>
      </el-card>
    </div>

    <!-- 导出报表dialog -->
    <el-dialog class="export-dialog" v-model="showDialog" :show-close="false">
      <div class="export-content">
        <div class="header">导出报表</div>

        <div class="center">
          <div class="date-sele">
            <label>选择日期范围:</label>
            <el-date-picker class="timer-tool" v-model="exportDateRange" type="daterange" align="right" unlink-panels
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div class="radio-sele">
            <label>选择统计方式:</label>
            <el-radio-group v-model="exportRadio">
              <el-radio :label="1">按天统计</el-radio>
              <el-radio :label="2">按周统计</el-radio>
              <el-radio :label="3">按月统计</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="footer">
          <i></i>
          <div>
            <el-button @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="exportReport">生成报表</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

import { useGlobalStore } from "@/store/global";
import { useChartData } from "./initChartData.ts";
import { deliveryReportTime, exportConsole } from '@/data';
import { chartIdName } from '@/interface/enum';
import { createAtag_Downlod } from "@/utils";

import HeaderCard from "@/components/headerCard/index.vue";

export default {
  components: { HeaderCard },
  setup() {
    const globalStore = useGlobalStore();

    // 当前选择的7day\year
    const deliveryPickerSele = ref(1);
    // 是否显示dialog
    const showDialog = ref(false);
    // 日历显示规则
    const pickerOptions = {
      disabledDate: (time: Date) => {
        let t = new Date();
        let Y = t.getFullYear();
        let M = t.getMonth();
        let D = t.getDate();
        return (time.getTime() < new Date(Y - 1, M, D).getTime() || time.getTime() > new Date(Y, M, D).getTime())
      }
    };
    // 导出报表类型
    const exportRadio = ref(0);
    const charHookInfo = useChartData({
      memberId: globalStore.userInfo?.id || 0,
      disinfectId: chartIdName.disinfectChartId,
      deliveryId: chartIdName.deliveryCharId
    });

    const { exportDateRange } = charHookInfo;

    const hideDialog = () => 
    {
      showDialog.value = false;
      exportDateRange.value = [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()];
      exportRadio.value = 1;
    };

    // 导出报表
    const exportReport = () => 
    {
      createAtag_Downlod(
        exportConsole, 
        {
          memberId: globalStore.userInfo?.id || 0,
          startTime: exportDateRange.value[0],
          endTime: exportDateRange.value[1],
          type: exportRadio.value
        }
      ).click();
      hideDialog();
    };

    const setShowDialog = () => showDialog.value = true;

    return {
      deliveryPickerSele,
      showDialog,
      deliveryReportTime,
      chartIdName,
      pickerOptions,
      exportRadio,
      hideDialog,
      exportReport,
      setShowDialog,
      ...charHookInfo
    }
  }
}
</script>

<style scoped lang="scss">
@import url("@/assets/style/console.scss");
</style>
