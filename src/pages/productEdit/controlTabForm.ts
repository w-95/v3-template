
import { onMounted, reactive, toRefs, ref } from "vue";

import { ElMessage } from 'element-plus/lib/components/index.js';

import { getProductInfo } from '@/request/product';

export const useControlTab = (productId: string, memberId: number ) => {

    const loading = ref(true);
    const state = reactive({
        ruleForm: {
            productName: "",
            productCode: "",
            robotStatus: "",
            coordMsg: "",
            rosMsg: "",
            controlType: -1,
            adbSwitch: '0',
            dateRange: "",
            scriptContent: "",
            productTypeId: -1,
            productLocationId: -1
        },
        rules: {
            controlType: [
                { required: true, message: '请选择控制类型', trigger: 'blur' }
            ],
            adbSwitch:[
                {required: true, message: '请选择adb开关', trigger: 'change'}
            ],
            dateRange: [{
                type: 'array',
                required: true,
                message: '请选择日期区间',
                fields: {
                        0: { type: 'date', required: true, message: '请选择开始日期' },
                        1: { type: 'date', required: true, message: '请选择结束日期' }
                    }
                }
            ],
            scriptContent:[
                { required: true, message: '内容不允许为空', trigger: 'blur' },
                { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
            ],
        }
    });

    onMounted( async () => {
        try {
            const { status, data } = await getProductInfo({ id: productId, productId, memberId });
        
            if(status === 0 && data) {
                const { productName, productCode, robotStatus, coordMsg, rosMsg, productTypeId, productLocationId } = data;
                state.ruleForm.productName = productName;
                state.ruleForm.productCode = productCode;
                state.ruleForm.robotStatus = robotStatus;
                state.ruleForm.coordMsg = coordMsg;
                state.ruleForm.rosMsg = rosMsg;
                state.ruleForm.productTypeId = productTypeId;
                state.ruleForm.productLocationId = productLocationId;
            };
        }catch(error) {
            ElMessage.error("获取产品信息异常!");
        };

        loading.value = false;
    });

    return {
        ...toRefs(state),
        ...toRefs(state.ruleForm),
        loading
    }
}