<template>
    <div class="login-box">
        <img src="@/assets/images/logo-left.png" class="login-left-bgc" />
        <img src="@/assets/images/logo-right.png" class="login-right-bgc" />
        <div class="login">
            <!-- <img src="@/static/images/logo.png" /> -->
            <div class="title">{{ $t(`loginForm.title`) }}</div>
            <router-view></router-view>
       </div>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
@import url("@/assets/style/loginIndex.scss");
</style>