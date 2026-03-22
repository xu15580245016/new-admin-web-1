<template>
  <el-table :data="data" style="width: 100%" v-loading="loading" v-bind="$attrs">
    <template v-for="column in columns" :key="column.prop || column.label">
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :align="column.align"
        :header-align="column.headerAlign"
      >
        <template #default="scope">
          <slot name="cell" v-bind="{ row: scope.row, column, index: scope.$index }">
            {{ column.prop ? scope.row[column.prop] : '' }}
          </slot>
        </template>
      </el-table-column>
    </template>
    
    <slot name="extra-columns"></slot>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// 列配置类型定义
export interface ColumnConfig<T = any> {
  prop?: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  // 标记需要自定义渲染的列
  custom?: boolean
}

defineProps<{
  data: any[]
  columns: ColumnConfig[]
  loading?: boolean
}>()
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
