<template>
  <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbData"
        :key="item.path"
      >
        <!-- 不可点击项 -->
        <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <!-- 可点击项 -->
        <a v-else class="redirect" @click.prevent="onLinkClick(item)">{{
          item.meta.title
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { watchDeep } from '@vueuse/core'

const route = useRoute();
const router = useRouter();

const breadcrumbData:any = ref([]);

const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter(
    item => item.meta && item.meta.title
  );
};

watchDeep(route, () => {
  getBreadcrumbData()
}, { immediate: true });

const onLinkClick = (item: any) => {
  console.log(item)
  router.push(item.path)
}
</script>

<style lang="scss" scoped>

</style>