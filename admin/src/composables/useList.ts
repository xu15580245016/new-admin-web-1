import { ref, reactive, onMounted, type Ref } from 'vue'

export interface ListState<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: {
    currentPage: number
    pageSize: number
    total: number
  }
  filters: Record<string, any>
}

export interface UseListOptions<T> {
  fetchData: () => Promise<{ data: T[]; total?: number }>
  immediate?: boolean
  pageSize?: number
}

export interface UseListReturn<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: {
    currentPage: number
    pageSize: number
    total: number
  }
  filters: Record<string, any>
  refresh: () => Promise<void>
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  handleFilterChange: (filters: Record<string, any>) => void
  handleDelete: (id: string, deleteFn: (id: string) => Promise<void>) => Promise<void>
}

export function useList<T = any>(options: UseListOptions<T>): UseListReturn<T> {
  const { fetchData, immediate = true, pageSize = 10 } = options

  const data = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)

  const pagination = reactive({
    currentPage: 1,
    pageSize,
    total: 0,
  })

  const filters = reactive<Record<string, any>>({})

  const refresh = async () => {
    loading.value = true
    try {
      const result = await fetchData()
      data.value = result.data
      if (result.total !== undefined) {
        pagination.total = result.total
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    pagination.currentPage = page
    refresh()
  }

  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    refresh()
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1
    refresh()
  }

  const handleDelete = async (id: string, deleteFn: (id: string) => Promise<void>) => {
    try {
      await deleteFn(id)
      await refresh()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  onMounted(() => {
    if (immediate) {
      refresh()
    }
  })

  return {
    data,
    loading,
    pagination,
    filters,
    refresh,
    handlePageChange,
    handleSizeChange,
    handleFilterChange,
    handleDelete,
  }
}
