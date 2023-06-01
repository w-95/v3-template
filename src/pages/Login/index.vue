<template>
    <div class="login-box">
        <!-- <canvas id="grid-wave-box"></canvas> -->
        <div class="login">
            <img src="@/static/images/logo.png" />
            <div class="title">{{ $t(`loginForm.title`) }}</div>
            <router-view></router-view>
       </div>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.login-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right bottom, #343f5f, #131b35 40%);
    background-image: url("@/static/images/login-bgc.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .login{
        width: 31.25vw;
        height: 25.625vw;
        // background: rgba(255,255,255,0.1);
        // box-shadow: 0px 16px 40px 0px rgba(176,175,194,0.33);
        border-radius: 18px;
        backdrop-filter: blur(30px);
        padding: 2.083vw 0 0 0;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.13);
        box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);

        .title {
            width: 100%;
            text-align: center;
            font-size: 1.4583vw;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFF;
            margin-top: .83vw;
        }
    }
}

.login-box::before{
    position: absolute;
    content: " ";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(0, 0, 200, 0.6), rgba(0, 0, 200, 0));
}

.login-box::after {
    width: 100%;
    height: 100%;
    background: linear-gradient(240deg, rgba(150, 50, 50, 0.6), rgba(0, 0, 200, 0));
}
</style>