import { ref, reactive, onMounted } from 'vue'
import type { Ref } from 'vue'

export interface ListState<T> {
  data: T[]
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  filters: Record<string, any>
}

export interface UseListOptions<T> {
  fetchFn: (params: any) => Promise<{ data: T[]; total?: number }>
  immediate?: boolean
  defaultFilters?: Record<string, any>
  defaultPageSize?: number
}

export function useList<T>(options: UseListOptions<T>) {
  const {
    fetchFn,
    immediate = true,
    defaultFilters = {},
    defaultPageSize = 10
  } = options

  const listState = reactive<ListState<T>>({
    data: [],
    loading: false,
    pagination: {
      page: 1,
      pageSize: defaultPageSize,
      total: 0
    },
    filters: { ...defaultFilters }
  })

  const fetchList = async () => {
    listState.loading = true
    try {
      const params = {
        page: listState.pagination.page,
        pageSize: listState.pagination.pageSize,
        ...listState.filters
      }
      const res = await fetchFn(params)
      listState.data = res.data || []
      listState.pagination.total = res.total || res.data?.length || 0
    } catch (error) {
      console.error('Fetch list error:', error)
      listState.data = []
      listState.pagination.total = 0
    } finally {
      listState.loading = false
    }
  }

  const refresh = () => {
    listState.pagination.page = 1
    return fetchList()
  }

  const resetFilters = () => {
    listState.filters = { ...defaultFilters }
    listState.pagination.page = 1
    return fetchList()
  }

  const handlePageChange = (page: number) => {
    listState.pagination.page = page
    return fetchList()
  }

  const handleSizeChange = (pageSize: number) => {
    listState.pagination.pageSize = pageSize
    listState.pagination.page = 1
    return fetchList()
  }

  const handleFilterChange = (filters: Record<string, any>) => {
    listState.filters = { ...listState.filters, ...filters }
    listState.pagination.page = 1
    return fetchList()
  }

  const removeItem = async (
    id: string | number,
    deleteFn: (id: string | number) => Promise<any>,
    options = { refresh: true }
  ) => {
    try {
      await deleteFn(id)
      if (options.refresh) {
        await refresh()
      } else {
        const index = listState.data.findIndex((item: any) => item._id === id || item.id === id)
        if (index > -1) {
          listState.data.splice(index, 1)
        }
      }
      return true
    } catch (error) {
      console.error('Delete item error:', error)
      return false
    }
  }

  const updateItem = (id: string | number, newData: Partial<T>) => {
    const index = listState.data.findIndex((item: any) => item._id === id || item.id === id)
    if (index > -1) {
      listState.data[index] = { ...listState.data[index], ...newData }
    }
  }

  onMounted(() => {
    if (immediate) {
      fetchList()
    }
  })

  return {
    listState,
    fetchList,
    refresh,
    resetFilters,
    handlePageChange,
    handleSizeChange,
    handleFilterChange,
    removeItem,
    updateItem
  }
}
