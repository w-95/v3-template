<template>
    <el-form :model="ruleForm" ref="subRefs" :rules="rules" class="login-form"
        @keyup.enter.native="submitForm">
        <el-form-item class="user-item" prop="username">
            <el-input :placeholder="$t(`loginForm.userNamePlayholder`)" v-model="ruleForm.username" class="user-ipt">
                <div slot="prefix" class="user-prefix">
                    <img src="@/static/images/username-icon.png" />
                </div>
            </el-input>
        </el-form-item>
        <el-form-item class="pwd-item" prop="password">
            <el-input :placeholder="$t(`loginForm.passwordPlayholder`)" v-model="ruleForm.password" show-password class="pwd-ipt">
                <div slot="prefix" class="pwd-prefix">
                    <img src="@/static/images/password-icon.png" />
                </div>
            </el-input>
        </el-form-item>
        <el-form-item class="pwd-item" style="margin-top: 2.083vw; width: 100%">
            <el-button type="primary" style="width: 100%; height: 50px;" @click="submitForm">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components/index.js';
// import { Input } from 'element-plus/lib/components/input';
import { useGlobalStore } from '@/store/global';
import pinia from "@/store/store";
import { useI18n } from 'vue-i18n';

import type { ElFormRef } from "../../../typings/element-plus.d.ts";

export default {
    setup() {
        const subRefs = ref<ElFormRef>();
        const globalStore = useGlobalStore(pinia);
        const router = useRouter();
        const { t } = useI18n();

        const ruleForm = reactive({
            username: "",
            password: ""
        });
        const rules = reactive({
            username: [
                { required: true, message: t(`loginForm.userErrorTips`), trigger: 'blur' }
            ],
            password: [
                { required: true, message: t(`loginForm.pwdErrTips`), trigger: 'blur' }
            ]
        });

        const submitForm = () => {
            if(subRefs.value) {
                subRefs.value.validate( async (valid: Boolean) => {
                if(valid) {
                    let { data, status, msg } = await globalStore.signIn( ruleForm );
                    if(data && status === 0) {
                        let [{ status: userStatus}, { status: menuStatus}] = await globalStore.updateUserInfo();
                        if( menuStatus !== 0 || userStatus !== 0) {
                            let msg = menuStatus !== 0? '获取侧边栏路由异常!': '获取用户信息异常!'
                            ElMessage.error(msg);
                            return;
                        };
                        router.push({ path: "/"});
                        return;
                    };
                    ElMessage.error(msg? msg: '获取Token异常!');
                    globalStore.setGlobalLoading(false);
                }
            })
            }
        };

        return { 
            ruleForm, 
            rules,
            submitForm,
            subRefs
        }
    },
}
</script>

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
        border-radius: 18px;
        // border: 1px solid rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        padding: 2.083vw 0 0 0;
        box-sizing: border-box;

        .login-form{
            width: 22.916vw;
            margin: 0 auto;
            margin-top: 2.083vw;
        }

        img {
            margin: 0 auto;
            width: 2.3vw;
            height: 2.3vw;
        }

        .title {
            width: 100%;
            text-align: center;
            font-size: 1.4583vw;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            margin-top: .83vw;
        }
    }
}

.user-ipt, .pwd-ipt {
    height: 50px;
}


</style>