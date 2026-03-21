<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    title="产品列表"
    page-title="产品管理"
    :show-preview="false"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #editTime="{ row }">
      {{ formatTime.getTime(row.editTime) }}
    </template>
  </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '../../components/DataTable/index.vue'
import { productApi } from '../../api'
import formatTime from '../../util/formatTime'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)

const columns = [
  { prop: 'title', label: '产品名称' },
  { prop: 'introduction', label: '简要描述' },
  { prop: 'editTime', label: '更新时间', slot: 'editTime' },
]

const getTableData = async () => {
  loading.value = true
  try {
    const res = await productApi.getList()
    tableData.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTableData()
})

const handleEdit = (item) => {
  router.push(`/product-manage/editproduct/${item._id}`)
}

const handleDelete = async (item) => {
  await productApi.delete(item._id)
  await getTableData()
}
</script>

<style scoped lang="scss">
</style>
