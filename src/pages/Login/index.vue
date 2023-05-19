<template>
    <div class="login-box">
        <!-- <canvas id="grid-wave-box"></canvas> -->
        <div class="login">
            <img src="@/static/images/logo.png" />
            <div class="title">智能机器人管理平台</div>
            <router-view></router-view>
       </div>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.login-box {
    width: 100%;
    height: 100%;
    // background: linear-gradient(to right bottom, #343f5f, #131b35 40%);
    background-image: url("@/static/images/login-bgc.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .login{
        width: 31.25vw;
        height: 25.625vw;
        background: rgba(255,255,255,0.1);
        // box-shadow: 0px 16px 40px 0px rgba(176,175,194,0.33);
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        padding: 2.083vw 0 0 0;
        box-sizing: border-box;

        .title {
            width: 100%;
            text-align: center;
            font-size: 1.4583vw;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000;
            margin-top: .83vw;
        }
    }
}
</style>