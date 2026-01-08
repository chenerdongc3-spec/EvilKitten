/**
 * 虚拟列表工具
 * 
 * 用于高效渲染大量列表项（如 AI 思考过程的长文本）
 * 只渲染可见区域的内容，提升性能
 * 
 * @example
 * ```typescript
 * const { visibleItems, containerProps, contentProps } = useVirtualList({
 *   items: longTextLines,
 *   itemHeight: 24,
 *   containerHeight: 300
 * })
 * ```
 */

import { ref, computed, type Ref } from 'vue'

/**
 * 虚拟列表配置选项
 */
export interface VirtualListOptions<T> {
  items: Ref<T[]>           // 所有列表项
  itemHeight: number        // 每项的固定高度（px）
  containerHeight: number   // 容器高度（px）
  overscan?: number         // 预渲染的额外项数（默认 3）
}

/**
 * 虚拟列表返回值
 */
export interface VirtualListReturn<T> {
  visibleItems: Ref<Array<{ index: number; data: T }>>  // 可见的列表项
  containerStyle: ComputedRef<Record<string, string>>   // 容器样式
  contentStyle: ComputedRef<Record<string, string>>     // 内容样式
  onScroll: (e: Event) => void                          // 滚动事件处理
  scrollToIndex: (index: number) => void                // 滚动到指定索引
  scrollToBottom: () => void                            // 滚动到底部
}

/**
 * 虚拟列表 Composable
 * 
 * @param options - 配置选项
 * @returns 虚拟列表控制对象
 */
export function useVirtualList<T>(
  options: VirtualListOptions<T>
): VirtualListReturn<T> {
  const {
    items,
    itemHeight,
    containerHeight,
    overscan = 3
  } = options

  // 滚动位置
  const scrollTop = ref(0)
  
  // 容器 DOM 引用
  const containerRef = ref<HTMLElement | null>(null)

  /**
   * 总高度（所有项的高度之和）
   */
  const totalHeight = computed(() => {
    return items.value.length * itemHeight
  })

  /**
   * 可见区域的起始索引
   */
  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
  })

  /**
   * 可见区域的结束索引
   */
  const endIndex = computed(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    return Math.min(
      items.value.length - 1,
      startIndex.value + visibleCount + overscan * 2
    )
  })

  /**
   * 可见的列表项（带索引）
   */
  const visibleItems = computed(() => {
    const result: Array<{ index: number; data: T }> = []
    for (let i = startIndex.value; i <= endIndex.value; i++) {
      const item = items.value[i]
      if (item !== undefined) {
        result.push({
          index: i,
          data: item
        })
      }
    }
    return result
  })

  /**
   * 容器样式
   */
  const containerStyle = computed(() => ({
    height: `${containerHeight}px`,
    overflow: 'auto',
    position: 'relative' as const
  }))

  /**
   * 内容包装器样式
   * 
   * 关键：不设置 height，只用 padding 占位
   * - paddingTop: 模拟上方未渲染的内容
   * - paddingBottom: 模拟下方未渲染的内容
   * - 实际渲染的内容自然撑开高度
   */
  const contentStyle = computed(() => {
    const topPadding = startIndex.value * itemHeight
    const bottomPadding = Math.max(0, (items.value.length - endIndex.value - 1) * itemHeight)
    
    return {
      position: 'relative' as const,
      paddingTop: `${topPadding}px`,
      paddingBottom: `${bottomPadding}px`
    }
  })

  /**
   * 处理滚动事件
   */
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  /**
   * 滚动到指定索引
   */
  const scrollToIndex = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * itemHeight
    }
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = totalHeight.value
    }
  }

  return {
    visibleItems,
    containerStyle,
    contentStyle,
    onScroll: handleScroll,
    scrollToIndex,
    scrollToBottom
  }
}

/**
 * 将长文本分割成行数组
 * 
 * @param text - 长文本
 * @returns 行数组
 */
export function splitTextToLines(text: string): string[] {
  return text.split('\n')
}

/**
 * 计算文本行数
 * 
 * @param text - 文本内容
 * @returns 行数
 */
export function countLines(text: string): number {
  return text.split('\n').length
}
