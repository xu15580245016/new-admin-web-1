<!---->
<template>
  <!-- 全局Loading -->
  <el-loading
    v-show="loadingStore.isLoading"
    :text="loadingStore.loadingText"
    background="rgba(255, 255, 255, 0.9)"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;"
  >
  </el-loading>
  <router-view></router-view>
</template>

<script setup>
import { useLoadingStore } from './store/loading'

const loadingStore = useLoadingStore()
</script>
<style>
html,
body,
#app {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}

/* 滚动条的样式优化 */
::-webkit-scrollbar {
  width: 5px;
  position: absolute;
}

::-webkit-scrollbar-thumb {
  background: #1890ff;
}

::-webkit-scrollbar-track {
  background-color: #ddd;
}
</style>
