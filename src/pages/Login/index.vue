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
.login-box {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-left-bgc{
        position: absolute;
        width: 780px;
        height: 765px;
        top: 0;
        left: 0;
    }

    .login-right-bgc {
        position: absolute;
        width: 800px;
        height: 100%;
        top: 0;
        right: 0;
    }

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
</style>