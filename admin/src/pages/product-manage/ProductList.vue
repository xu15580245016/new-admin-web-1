<!---->
<template>
    <el-card>
        <el-page-header content="产品列表" icon="" title="产品管理" />
        <DataTable :data="tableData" :columns="columns">
            <template #editTime="{ row }">
                {{ formatTime.getTime(row.editTime) }}
            </template>
            <template #operation="{ row }">
                <el-button size="small" circle :icon="Edit" @click="handleEdit(row)"></el-button>
                <el-popconfirm title="确认删除嘛？" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDelete(row)">
                    <template #reference>
                        <el-button size="small" circle :icon="Delete" type="danger"></el-button>
                    </template>
                </el-popconfirm>
            </template>
        </DataTable>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete, } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import formatTime from '../../util/formatTime'
import DataTable from '../../components/DataTable/index.vue'
import { getProductList, deleteProduct } from '../../api/product'

const tableData = ref([])

const columns = [
    { prop: 'title', label: '产品名称' },
    { prop: 'introduction', label: '简要描述' },
    { prop: 'editTime', label: '更新时间', slot: 'editTime' }
]

onMounted(() => {
    getTableDate()
})

const getTableDate = async () => {
    const res = await getProductList()
    tableData.value = res.data
}

const handleDelete = async (item) => {
    await deleteProduct(item._id)
    await getTableDate()
}

const router = useRouter()
const handleEdit = (item) => {
    router.push(`/product-manage/editproduct/${item._id}`)
}
</script>

<style scoped lang="scss">
:deep(.htmlContent) img {
    max-width: 100%;
}
</style>
