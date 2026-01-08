<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <Sidebar @close="closeSidebar" />
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <ChatView @toggle-sidebar="toggleSidebar" />
    </main>

    <!-- 移动端遮罩 -->
    <div 
      v-if="isSidebarOpen" 
      class="overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import ChatView from '@/views/ChatView.vue'

// 侧边栏状态
const isSidebarOpen = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 响应式处理
const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  flex-shrink: 0;
  transition: transform var(--transition-normal);

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);

    &.sidebar-open {
      transform: translateX(0);
    }
  }
}

.main-content {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.overlay {
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn var(--transition-fast);
  }
}
</style>
