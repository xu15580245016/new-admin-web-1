<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    title="新闻列表"
    page-title="新闻管理"
    :show-preview="true"
    @preview="handlePreview"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #category="{ row }">
      {{ categoryFormat(row.category) }}
    </template>
    <template #editTime="{ row }">
      {{ formatTime.getTime(row.editTime) }}
    </template>
    <template #isPublish="{ row }">
      <el-switch
        v-model="row.isPublish"
        :active-value="1"
        :inactive-value="0"
        @change="handleSwitchChange(row)"
      />
    </template>
  </DataTable>
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
import { useRouter } from 'vue-router'
import { StarFilled } from '@element-plus/icons-vue'
import DataTable from '../../components/DataTable/index.vue'
import { newsApi } from '../../api'
import formatTime from '../../util/formatTime'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const previewData = ref({})
const dialogVisible = ref(false)

const columns = [
  { prop: 'title', label: '标题' },
  { prop: 'category', label: '分类', slot: 'category' },
  { prop: 'editTime', label: '更新时间', slot: 'editTime' },
  { prop: 'isPublish', label: '是否发布', slot: 'isPublish' },
]

const getTableData = async () => {
  loading.value = true
  try {
    const res = await newsApi.getList()
    tableData.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTableData()
})

const categoryFormat = (category) => {
  const arr = ['最新动态', '典型案例', '通告公共']
  return arr[category - 1]
}

const handleSwitchChange = async (item) => {
  await newsApi.publish(item._id, item.isPublish)
  await getTableData()
}

const handlePreview = (data) => {
  previewData.value = data
  dialogVisible.value = true
}

const handleEdit = (item) => {
  router.push(`/news-manage/editnews/${item._id}`)
}

const handleDelete = async (item) => {
  await newsApi.delete(item._id)
  await getTableData()
}
</script>

<style scoped lang="scss">
:deep(.htmlContent) img {
  max-width: 100%;
}
</style>
