<template>
  <el-card v-loading="loading">
    <el-page-header v-if="title" :content="title" :icon="''" :title="pageTitle" />
    <el-table :data="data" style="width: 100%">
      <template v-for="column in columns" :key="column.prop">
        <el-table-column
          v-if="!column.slot"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
        />
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
        >
          <template #default="scope">
            <slot :name="column.slot" :row="scope.row" :$index="scope.$index">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="showActions" label="操作" :width="actionsWidth" :fixed="actionsFixed">
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index">
            <template v-if="defaultActions">
              <el-button
                v-if="showPreview"
                size="small"
                circle
                :icon="Star"
                type="success"
                @click="handlePreview(scope.row)"
              />
              <el-button
                v-if="showEdit"
                size="small"
                circle
                :icon="Edit"
                @click="handleEdit(scope.row)"
              />
              <el-popconfirm
                v-if="showDelete"
                title="确认删除嘛？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button size="small" circle :icon="Delete" type="danger" />
                </template>
              </el-popconfirm>
            </template>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPagination"
      class="pagination"
      v-model:current-page="currentPageModel"
      v-model:page-size="pageSizeModel"
      :page-sizes="pageSizes"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, Edit, Delete } from '@element-plus/icons-vue'

export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean | string
  slot?: string
}

export interface DataTableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  title?: string
  pageTitle?: string
  showActions?: boolean
  actionsWidth?: number | string
  actionsFixed?: 'left' | 'right' | boolean
  defaultActions?: boolean
  showPreview?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showPagination?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
}

const props = withDefaults(defineProps<DataTableProps>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  title: '',
  pageTitle: '',
  showActions: true,
  actionsWidth: 180,
  actionsFixed: false,
  defaultActions: true,
  showPreview: false,
  showEdit: true,
  showDelete: true,
  showPagination: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
})

const emit = defineEmits<{
  (e: 'preview', row: any): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val),
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
})

const handlePreview = (row: any) => {
  emit('preview', row)
}

const handleEdit = (row: any) => {
  emit('edit', row)
}

const handleDelete = (row: any) => {
  emit('delete', row)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleCurrentChange = (page: number) => {
  emit('current-change', page)
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
