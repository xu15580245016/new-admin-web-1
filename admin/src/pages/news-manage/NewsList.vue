<!---->
<template>
    <el-card>
        <el-page-header content="新闻列表" icon="" title="新闻管理" />
        <DataTable :data="tableData" :columns="columns">
            <template #category="{ row }">
                {{ categoryFormat(row.category) }}
            </template>
            <template #editTime="{ row }">
                {{ formatTime.getTime(row.editTime) }}
            </template>
            <template #isPublish="{ row }">
                <el-switch v-model="row.isPublish" :active-value="1" :inactive-value="0"
                    @change="handleSwitchChange(row)" />
            </template>
            <template #operation="{ row }">
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
import { ref, onMounted } from 'vue'
import { Star, Edit, Delete, StarFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import formatTime from '../../util/formatTime'
import DataTable from '../../components/DataTable/index.vue'
import { getNewsList, deleteNews, updateNewsPublish } from '../../api/news'

const tableData = ref([])
const previewData = ref({})
const dialogVisible = ref(false)

const columns = [
    { prop: 'title', label: '标题' },
    { prop: 'category', label: '分类', slot: 'category' },
    { prop: 'editTime', label: '更新时间', slot: 'editTime' },
    { prop: 'isPublish', label: '是否发布', slot: 'isPublish' }
]

onMounted(() => {
    getTableDate()
})

const getTableDate = async () => {
    const res = await getNewsList()
    tableData.value = res.data
}

const categoryFormat = (category) => {
    const arr = ['最新动态', '典型案例', '通告公共']
    return arr[category - 1]
}

const handleSwitchChange = async (item) => {
    await updateNewsPublish({ _id: item._id, isPublish: item.isPublish })
    await getTableDate()
}

const handlePreview = (data) => {
    previewData.value = data
    dialogVisible.value = true
}

const handleDelete = async (item) => {
    await deleteNews(item._id)
    await getTableDate()
}

const router = useRouter()
const handleEdit = (item) => {
    router.push(`/news-manage/editnews/${item._id}`)
}
</script>

<style scoped lang="scss">
:deep(.htmlContent) img {
    max-width: 100%;
}
</style>
