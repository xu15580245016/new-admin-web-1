<!---->
<template>
    <el-card>
        <el-page-header content="产品列表" icon="" title="产品管理" />
        <DataTable :data="tableData" :columns="columns" :loading="loading">
            <template #cell="{ row, column }">
                <template v-if="column.prop === 'editTime'">
                    {{ formatTime.getTime(row.editTime) }}
                </template>
                <template v-else-if="column.prop === 'actions'">
                    <el-button size="small" circle :icon="Edit" @click="handleEdit(row)"></el-button>
                    <el-popconfirm title="确认删除嘛？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button size="small" circle :icon="Delete" type="danger"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
                <template v-else>
                    {{ row[column.prop] }}
                </template>
            </template>
        </DataTable>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { DataTable } from '../../components/DataTable'
import { getProductList, deleteProduct } from '../../api'
import formatTime from '../../util/formatTime'

const tableData = ref([])
const loading = ref(false)

const columns = [
    { prop: 'title', label: '产品名称', minWidth: 200 },
    { prop: 'introduction', label: '简要描述', minWidth: 200 },
    { prop: 'editTime', label: '更新时间', width: 150 },
    { prop: 'actions', label: '操作', width: 150, fixed: 'right' }
]

onMounted(() => {
    getTableDate()
})

const getTableDate = async () => {
    loading.value = true
    try {
        const res = await getProductList()
        tableData.value = res.data
    } finally {
        loading.value = false
    }
}

//删除回调
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