<template>
  <div class="console-box animate__backInDown animate__animated">
    <div class="header-card-box">

      <el-card class="item-card" v-for="(card, index) in cards" :key="index">
        <HeaderCard v-bind="{ ...card }"></HeaderCard>
      </el-card>

    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getProductChartData } from "@/request/product.ts";
import { useGlobalStore } from "@/store/global";
import { consoleHeaderCard } from "@/data";

import HeaderCard from "@/components/headerCard/index.vue";

export default {
  setup() {
    const globalStore = useGlobalStore();

    const startTime = ref(new Date(new Date().setDate(new Date().getDate() - 6)).Format("yyyy-MM-dd"));
    const endTime = ref(new Date().Format("yyyy-MM-dd"));
    const cards = reactive(consoleHeaderCard)

    onMounted(async () => {
      // chart data
      const { status: chartStatus, data: chartData } = await getProductChartData(
        {
          startTime: startTime.value,
          endTime: endTime.value,
          memberId: globalStore.userInfo?.id || 0
        }
      );

      // init card 4
      if (chartStatus === 0 && chartData) {
        const { allTimerTaskStatistics, weekTimerTaskStatistics, allOrderStatistics, weekOrderStatistics, productCount, appMemberCount } = chartData;
        consoleHeaderCard[0].topCount = allTimerTaskStatistics;
        consoleHeaderCard[0].bottomCount = weekTimerTaskStatistics;

        consoleHeaderCard[1].topCount = allOrderStatistics;
        consoleHeaderCard[1].bottomCount = weekOrderStatistics;

        consoleHeaderCard[2].topCount = productCount;

        consoleHeaderCard[3].topCount = appMemberCount;

      };
    });

    return {
      cards
    }
  }
}
</script>

<style scoped lang="scss">
.console-box {
  width: 100%;
  height: 100%;
  
  .header-card-box{
    width: 100%;
    height: 260px;
    display: flex;
    justify-content: space-between;

    .item-card{
      width: 395px;
      height: 100%;
      border-radius: 16px;
    }
  }
}
</style>
