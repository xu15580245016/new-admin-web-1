<!---->
<template>
    <el-card>
        <el-page-header content="新闻列表" icon="" title="新闻管理" />
        <DataTable
            :table-data="listState.data"
            :columns="columns"
            :loading="listState.loading"
            @switch-change="handleSwitchChange"
        >
            <template #category="{ row }">
                {{ categoryFormat(row.category) }}
            </template>
            <template #editTime="{ row }">
                {{ formatTime.getTime(row.editTime) }}
            </template>
            <template #actions="{ row }">
                <el-button size="small" circle :icon="Star" type="success"
                    @click="handlePreview(row)"></el-button>
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
    <el-dialog title="预览新闻" width="50%" v-model="dialogVisible">
        <div>
            <h2>{{ previewData.title }}</h2>
            <p style="margin-top: 5px;">{{ formatTime.getTime(previewData.editTime) }}</p>
            <el-divider>
                <el-icon><star-filled /></el-icon>
            </el-divider>
            <div v-html="previewData.content" class="htmlContent"></div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Star, Edit, Delete, StarFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import formatTime from '../../util/formatTime'
import { DataTable } from '../../components/DataTable'
import { useList } from '../../composables/useList'
import { getNewsList, deleteNews, publishNews, type NewsItem } from '../../api/news'

const router = useRouter()
const previewData = ref({})
const dialogVisible = ref(false)

// 表格列配置
const columns = reactive([
    { prop: 'title', label: '标题', showOverflowTooltip: true },
    { prop: 'category', label: '分类', slotName: 'category' },
    { prop: 'editTime', label: '更新时间', slotName: 'editTime' },
    { prop: 'isPublish', label: '是否发布', type: 'switch', activeValue: 1, inactiveValue: 0 },
    { label: '操作', type: 'actions', width: 200, fixed: 'right' }
])

// 使用 useList composable
const { listState, refresh, removeItem } = useList<NewsItem>({
    fetchFn: async (params) => {
        const res = await getNewsList(params)
        return { data: res.data.data || [] }
    }
})

// 格式化分类信息
const categoryFormat = (category) => {
    const arr = ['最新动态', '典型案例', '通告公共']
    return arr[category - 1]
}

const handleSwitchChange = async (val, row, column) => {
    try {
        await publishNews({ _id: row._id, isPublish: val })
        ElMessage.success('状态更新成功')
    } catch (error) {
        ElMessage.error('状态更新失败')
        await refresh()
    }
}

//预览回调
const handlePreview = (data) => {
    previewData.value = data
    dialogVisible.value = true
}

//删除回调
const handleDelete = async (item) => {
    const success = await removeItem(item._id, deleteNews)
    if (success) {
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}

const handleEdit = (item) => {
    router.push(`/news-manage/editnews/${item._id}`)
}
</script>

<style scoped lang="scss">
:deep(.htmlContent) img {
    max-width: 100%;
}
</style>
