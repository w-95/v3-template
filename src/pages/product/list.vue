<template>
    <div class="pord-list-box">
        <el-form :inline="true" :model="search" class="demo-form-inline" @keyup.enter.native="onSubmit">
            <el-form-item label="产品类型">
                <el-select v-model="search.productType" placeholder="产品类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(list, index) in typeList" :label="list.type" :value="list.id"
                        :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品/客户名称">
                <el-input v-model="search.productName" placeholder="产品/客户名称"></el-input>
            </el-form-item>
            <el-form-item label="产品编号">
                <el-input v-model="search.productCode" placeholder="产品编号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitQuery">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="pord-content">
            <el-table :data="tableData" stripe class="table-box" v-loading="loading" header-row-class-name="table-header-row-h" row-class-name="table-row-h">
                <el-table-column prop="productCode" label="机器人编号"></el-table-column>
                <el-table-column prop="productName" label="机器人名称">
                    <template #default="scope">
                        <!-- <router-link v-if="!globalStore.checkRole_USER()"
                        style='color:#409fff;'>{{ scope.row.name }}</router-link> -->
                        <div>{{ scope.row.productName }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="productType" label="产品类型"></el-table-column>
                <el-table-column prop="productLocation" label="使用地点"></el-table-column>
                <el-table-column prop="robotStatus" label="状态" align="center"></el-table-column>
                <el-table-column prop="operation" label="操作" align="center">
                    <template #default="scope">
                        <div style="display: flex; justify-content: center;"
                            v-show="scope.row.productTypeId == 5">
                            <el-button style="color: #409eff" size="mini" @click="robotDetail(scope.row)"
                                :disabled="isDetail(scope.row.robotStatusId)">查看详情</el-button>

                            <el-button type="primary" size="mini" @click="callPage(scope.row)"
                                :disabled="isDetail(scope.row.robotStatusId)">呼叫</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="管理员权限" align="center" v-if="!globalStore.checkRole_USER()">
                    <template #default="scope">
                        <el-button style="color: #409eff" size="mini" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <template #empty v-if="!loading && !tableData.length">
                    <emptyComent></emptyComent>
                </template>
            </el-table>

            <div class="pagination-box">
                <el-pagination
                    background
                    small
                    hide-on-single-page
                    v-model:current-page="pageInfo.pageNum"
                    v-model:page-size="pageInfo.pageSize"
                    layout="prev, pager, next, jumper"
                    :total="pageInfo.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, Ref, onMounted } from 'vue';
import { useRouter } from "vue-router";

import { getProductTypes, getPordtList } from '@/request/product.ts';

import { robotsTCodeT } from '@/interface/product.ts';

import { useGlobalStore } from '@/store/global';
import { isOffline } from "@/utils/robot.ts";

import emptyComent from '@/components/tableEmptyTips/index.vue';



const router = useRouter();

const search = reactive({
    productCode: '',
    productType: '',
    productName: ''
});

let pageInfo = reactive({
    pageNum: 1,
    pageSize: 10,
    pages: 1,
    total: 0
});

const globalStore = useGlobalStore();
const typeList: Ref<robotsTCodeT[]> = ref([]);
let tableData = ref([]);
let loading = ref(false);

onMounted(async () => {
    loading.value = true;
    const { status, data } = await getProductTypes();
    if (status === 0) typeList.value = data;
    onSubmit();
});

const onSubmit = async () => {
    const params = Object.assign({}, { ...search, ...pageInfo }, { productTypeId: search.productType });

    const { status, data } = await getPordtList(params);

    if (status === 0 && data) {
        const { size, list, ...dataPageInfo } = data;
        pageInfo = dataPageInfo;
        tableData.value = list;
    };
    loading.value = false;
};

const robotDetail = (row: any) => {
    console.log(row)
};

const submitQuery = () => {
    loading.value = true;
    pageInfo.pageNum = 1;
    onSubmit();
};

const callPage = (row: any) => {
    console.log(row)
};

const handleSizeChange = () => {

};

const handleCurrentChange = () => {

};

// 编辑
const edit = (row: any) => 
{
    const { id, robotStatusId, productLocationId } = row;
    const query = { productId: id, statusId: robotStatusId, locationId: productLocationId, defalutTab: 1 };
    router.push({name: 'ProdEdit', query: query});
}

// 在线才能点击查看详情和呼叫
const isDetail = isOffline;

</script>

<style lang="scss" scoped>
.pord-list-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    

    .demo-form-inline {
        height: 60px;
        box-sizing: border-box;
        text-align: left;
        line-height: 60px;
    }

    ::-webkit-scrollbar {
            width: 0;
            height: 10px;
        }

    .pord-content{
        height: calc(100% - 60px);
        background-color: #FFF;
        border-radius: 16px;
        padding: 0 10px;
        box-sizing: border-box;
        overflow-y: scroll;
    }
}
</style>