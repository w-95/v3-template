<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item class="header-nav-font" :to="{ path: '/' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item>
    <el-breadcrumb-item class="header-nav-font">promotion list</el-breadcrumb-item>
    <el-breadcrumb-item class="header-nav-font">promotion detail</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>

import { ArrowRight } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>

</style>