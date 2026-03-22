<template>
  <div class="data-table-wrapper">
    <!-- 加载状态 -->
    <el-skeleton :rows="5" animated v-if="loading" />
    
    <!-- 表格主体 -->
    <el-table
      v-else
      :data="tableData"
      style="width: 100%"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
      />
      
      <!-- 动态列配置 -->
      <template v-for="column in columns" :key="column.prop || column.label">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :formatter="column.formatter"
        >
          <template #default="scope">
            <!-- 自定义插槽 -->
            <slot
              v-if="column.slot"
              :name="column.slot"
              :row="scope.row"
              :column="scope.column"
              :$index="scope.$index"
              :cell-value="scope.row[column.prop || '']"
            >
              {{ scope.row[column.prop || ''] }}
            </slot>
            <!-- 默认显示 -->
            <template v-else>
              {{ scope.row[column.prop || ''] }}
            </template>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        :label="operationLabel"
        :width="operationWidth"
        :fixed="operationFixed"
        align="center"
      >
        <template #default="scope">
          <slot
            name="operation"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index"
          >
            <!-- 默认操作按钮 -->
            <el-button
              v-if="showEdit"
              size="small"
              :icon="Edit"
              @click.stop="handleEdit(scope.row)"
            />
            <el-button
              v-if="showDelete"
              size="small"
              type="danger"
              :icon="Delete"
              @click.stop="handleDelete(scope.row)"
            />
          </slot>
        </template>
      </el-table-column>
      
      <!-- 空数据状态 -->
      <template #empty>
        <slot name="empty">
          <el-empty description="暂无数据" />
        </slot>
      </template>
    </el-table>
    
    <!-- 分页组件 -->
    <div v-if="showPagination && !loading" class="pagination-wrapper">
      <slot
        name="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      >
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          :layout="paginationLayout"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import type { TableColumn } from '../../api/types';

// Props 定义
interface Props {
  // 表格数据
  data: any[];
  // 列配置
  columns: TableColumn[];
  // 加载状态
  loading?: boolean;
  // 是否显示选择列
  showSelection?: boolean;
  // 是否显示序号列
  showIndex?: boolean;
  // 是否显示操作列
  showOperation?: boolean;
  // 操作列标题
  operationLabel?: string;
  // 操作列宽度
  operationWidth?: string | number;
  // 操作列固定位置
  operationFixed?: boolean | 'left' | 'right';
  // 是否显示编辑按钮
  showEdit?: boolean;
  // 是否显示删除按钮
  showDelete?: boolean;
  // 是否显示分页
  showPagination?: boolean;
  // 总条数
  total?: number;
  // 当前页
  pageNum?: number;
  // 每页条数
  pageSize?: number;
  // 每页条数选项
  pageSizes?: number[];
  // 分页布局
  paginationLayout?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  showSelection: false,
  showIndex: false,
  showOperation: false,
  operationLabel: '操作',
  operationWidth: 150,
  operationFixed: false,
  showEdit: true,
  showDelete: true,
  showPagination: false,
  total: 0,
  pageNum: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper'
});

// Emits 定义
const emit = defineEmits<{
  (e: 'selection-change', selection: any[]): void;
  (e: 'sort-change', params: { column: any; prop: string; order: string }): void;
  (e: 'row-click', row: any, column: any, event: Event): void;
  (e: 'edit', row: any): void;
  (e: 'delete', row: any): void;
  (e: 'update:pageNum', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'pagination-change', params: { page: number; size: number }): void;
}>();

// 内部状态
const currentPage = ref(props.pageNum);
const pageSize = ref(props.pageSize);

// 监听外部页码变化
watch(() => props.pageNum, (val) => {
  currentPage.value = val;
});

watch(() => props.pageSize, (val) => {
  pageSize.value = val;
});

// 计算属性：表格数据
const tableData = computed(() => props.data);

// 事件处理方法
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection);
};

const handleSortChange = (params: { column: any; prop: string; order: string }) => {
  emit('sort-change', params);
};

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event);
};

const handleEdit = (row: any) => {
  emit('edit', row);
};

const handleDelete = (row: any) => {
  emit('delete', row);
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  emit('update:pageSize', size);
  emit('pagination-change', { page: currentPage.value, size });
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  emit('update:pageNum', page);
  emit('pagination-change', { page, size: pageSize.value });
};

// 暴露方法给父组件
defineExpose({
  // 获取当前分页信息
  getPagination: () => ({
    page: currentPage.value,
    size: pageSize.value
  }),
  // 重置分页
  resetPagination: () => {
    currentPage.value = 1;
    pageSize.value = props.pageSize;
  }
});
</script>

<style scoped lang="scss">
.data-table-wrapper {
  width: 100%;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
