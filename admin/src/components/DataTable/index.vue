<template>
  <el-table :data="data" style="width: 100%" v-loading="loading">
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :min-width="col.minWidth"
      :fixed="col.fixed"
      :sortable="col.sortable"
    >
      <template #default="scope" v-if="col.slot">
        <slot :name="col.slot" :row="scope.row" :$index="scope.$index"></slot>
      </template>
      <template #default="scope" v-else-if="col.formatter">
        {{ col.formatter(scope.row[col.prop], scope.row) }}
      </template>
    </el-table-column>
    <el-table-column v-if="$slots.operation" label="操作" :width="operationWidth" fixed="right">
      <template #default="scope">
        <slot name="operation" :row="scope.row" :$index="scope.$index"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean
  slot?: string
  formatter?: (value: any, row: any) => string
}

defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true,
    default: () => []
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  operationWidth: {
    type: [Number, String],
    default: 200
  }
})
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
}
</style>
