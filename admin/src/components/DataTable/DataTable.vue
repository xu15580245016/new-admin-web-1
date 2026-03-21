<template>
  <el-table
    :data="tableData"
    v-loading="loading"
    v-bind="$attrs"
    style="width: 100%"
  >
    <template v-for="column in columns" :key="column.prop || column.label">
      <!-- 自定义列插槽 -->
      <el-table-column
        v-if="column.slotName"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        :header-align="column.headerAlign"
      >
        <template #default="scope">
          <slot :name="column.slotName" v-bind="scope">
            {{ scope.row[column.prop] }}
          </slot>
        </template>
        <template v-if="column.headerSlotName" #header="scope">
          <slot :name="column.headerSlotName" v-bind="scope"></slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-else-if="column.type === 'actions'"
        :label="column.label || '操作'"
        :width="column.width || 200"
        :fixed="column.fixed"
        :align="column.align || 'center'"
      >
        <template #default="scope">
          <slot name="actions" v-bind="scope"></slot>
        </template>
      </el-table-column>

      <!-- 开关列 -->
      <el-table-column
        v-else-if="column.type === 'switch'"
        :prop="column.prop"
        :label="column.label"
        :width="column.width || 120"
        :align="column.align || 'center'"
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row[column.prop]"
            :active-value="column.activeValue || 1"
            :inactive-value="column.inactiveValue || 0"
            @change="(val) => handleSwitchChange(val, scope.row, column)"
          />
        </template>
      </el-table-column>

      <!-- 标签列 -->
      <el-table-column
        v-else-if="column.type === 'tag'"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
      >
        <template #default="scope">
          <el-tag
            :type="getColumnTagType(scope.row[column.prop], column)"
            :effect="column.effect || 'light'"
          >
            {{ getColumnTagText(scope.row[column.prop], column) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 默认列 -->
      <el-table-column
        v-else
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :align="column.align"
        :header-align="column.headerAlign"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <template #default="scope">
          <span v-if="column.formatter">
            {{ column.formatter(scope.row[column.prop], scope.row) }}
          </span>
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>
    </template>

    <!-- 扩展插槽 - 预留位置 -->
    <slot name="table-append"></slot>
  </el-table>
</template>

<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'

export interface DataTableColumn<T = any> {
  prop?: keyof T | string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  slotName?: string
  headerSlotName?: string
  type?: 'actions' | 'switch' | 'tag'
  activeValue?: any
  inactiveValue?: any
  formatter?: (value: any, row: T) => string
  tags?: Record<string | number, { text: string; type: string }>
  effect?: 'dark' | 'light' | 'plain'
}

export interface DataTableProps<T = any> {
  tableData: T[]
  columns: DataTableColumn<T>[]
  loading?: boolean
}

defineProps<DataTableProps>()

const emit = defineEmits<{
  switchChange: [val: any, row: any, column: DataTableColumn]
}>()

const handleSwitchChange = (val: any, row: any, column: DataTableColumn) => {
  emit('switchChange', val, row, column)
}

const getColumnTagType = (value: any, column: DataTableColumn): string => {
  if (column.tags && column.tags[value]) {
    return column.tags[value].type || 'info'
  }
  return 'info'
}

const getColumnTagText = (value: any, column: DataTableColumn): string => {
  if (column.tags && column.tags[value]) {
    return column.tags[value].text || String(value)
  }
  return String(value)
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
}
</style>
