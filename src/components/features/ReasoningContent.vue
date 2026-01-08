<template>
  <div class="reasoning-content">
    <!-- 折叠/展开按钮 -->
    <button 
      class="reasoning-toggle" 
      @click="toggleExpanded"
      :title="isExpanded ? '收起思考过程' : '展开思考过程'"
    >
      <el-icon class="toggle-icon" :class="{ expanded: isExpanded }">
        <ArrowDown />
      </el-icon>
      <span class="toggle-text">
        {{ isExpanded ? '收起' : '展开' }}思考过程
      </span>
      <span class="line-count">({{ lineCount }} 行)</span>
    </button>

    <!-- 思考内容（使用虚拟列表） -->
    <transition name="expand">
      <div 
        v-if="isExpanded" 
        class="reasoning-container"
        :style="containerStyle"
        @scroll="onScroll"
      >
        <div 
          class="reasoning-content-wrapper"
          :style="contentStyle"
        >
          <div
            v-for="item in visibleItems"
            :key="item.index"
            class="reasoning-line"
          >
            {{ item.data }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useVirtualList, splitTextToLines, countLines } from '@/utils/virtualList'

/**
 * 思考内容展示组件
 * 
 * 使用虚拟列表渲染 AI 的思考过程
 * 支持折叠/展开，提升性能
 */

interface Props {
  content: string           // 思考内容
  maxHeight?: number        // 最大高度（默认 300px）
  defaultExpanded?: boolean // 默认是否展开
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 300,
  defaultExpanded: false
})

// 展开状态
const isExpanded = ref(props.defaultExpanded)

// 每行高度（px）- 用于虚拟列表计算可见区域
const itemHeight = 24

// 将文本分割成行
const lines = computed(() => splitTextToLines(props.content))

// 行数
const lineCount = computed(() => countLines(props.content))

// 虚拟列表
const {
  visibleItems,
  containerStyle,
  contentStyle,
  onScroll,
  scrollToBottom
} = useVirtualList({
  items: lines,
  itemHeight,
  containerHeight: props.maxHeight,
  overscan: 5
})

// 切换展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// 监听内容变化，自动滚动到底部（流式接收时）
watch(() => props.content, () => {
  if (isExpanded.value) {
    scrollToBottom()
  }
})
</script>

<style scoped lang="scss">
.reasoning-content {
  margin-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border);
  padding-top: var(--spacing-sm);
}

.reasoning-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  color: var(--color-textSecondary);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-primary);
  }
}

.toggle-icon {
  font-size: 16px;
  transition: transform var(--transition-fast);

  &.expanded {
    transform: rotate(180deg);
  }
}

.toggle-text {
  font-weight: 500;
}

.line-count {
  margin-left: auto;
  opacity: 0.7;
}

.reasoning-container {
  margin-top: var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: var(--font-sm);
  color: var(--color-textSecondary);
  overflow: auto;
  position: relative;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.reasoning-content-wrapper {
  position: relative;
}

.reasoning-line {
  padding: 0 var(--spacing-md);
  min-height: 24px;
  line-height: 24px;
  white-space: pre-wrap;
  word-break: break-word;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  box-sizing: border-box;

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
}

/* 展开/收起动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all var(--transition-normal);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 300px;
  opacity: 1;
  margin-top: var(--spacing-sm);
}
</style>
