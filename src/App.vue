<template>
  <AppLayout />
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useThemeStore } from '@/stores/theme'
import { useChatStore } from '@/stores/chat'

/**
 * 应用根组件
 * 
 * 在 <script setup> 顶层调用 store 是安全的，因为：
 * 1. main.ts 中已经通过 app.use(pinia) 注册了 Pinia
 * 2. Vue 会在 mount 之后才开始渲染组件
 * 3. 组件的 setup 函数执行时，Pinia 已经可用
 */

// 初始化 store（在组件 setup 阶段执行）
const themeStore = useThemeStore()
const chatStore = useChatStore()

// 加载持久化数据
themeStore.loadTheme()
chatStore.loadConversations()
</script>

<style>
/* 全局样式已在 global.scss 中定义 */
</style>
