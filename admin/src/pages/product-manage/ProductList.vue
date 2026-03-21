<!---->
<template>
    <el-card>
        <el-page-header content="产品列表" icon="" title="产品管理" />
        <DataTable
            :table-data="listState.data"
            :columns="columns"
            :loading="listState.loading"
        >
            <template #editTime="{ row }">
                {{ formatTime.getTime(row.editTime) }}
            </template>
            <template #actions="{ row }">
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
import { reactive } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import formatTime from '../../util/formatTime'
import { DataTable } from '../../components/DataTable'
import { useList } from '../../composables/useList'
import { getProductList, deleteProduct, type ProductItem } from '../../api/product'

const router = useRouter()

// 表格列配置
const columns = reactive([
    { prop: 'title', label: '产品名称', showOverflowTooltip: true },
    { prop: 'introduction', label: '简要描述', showOverflowTooltip: true },
    { prop: 'editTime', label: '更新时间', slotName: 'editTime' },
    { label: '操作', type: 'actions', width: 120, fixed: 'right' }
])

// 使用 useList composable
const { listState, removeItem } = useList<ProductItem>({
    fetchFn: async (params) => {
        const res = await getProductList(params)
        return { data: res.data.data || [] }
    }
})

//删除回调
const handleDelete = async (item) => {
    const success = await removeItem(item._id, deleteProduct)
    if (success) {
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}

const handleEdit = (item) => {
    router.push(`/product-manage/editproduct/${item._id}`)
}
</script>

<style scoped lang="scss">
</style>
