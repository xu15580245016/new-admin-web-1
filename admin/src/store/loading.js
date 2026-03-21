import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
        loadingText: '加载中...'
    }),
    actions: {
        startLoading(text = '加载中...') {
            this.isLoading = true
            this.loadingText = text
        },
        stopLoading() {
            this.isLoading = false
            this.loadingText = '加载中...'
        }
    }
})
