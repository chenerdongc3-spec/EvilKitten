<template>
  <div class="sidebar-container">
    <!-- 头部 -->
    <div class="sidebar-header">
      <div class="app-info">
        <button class="app-icon" @click="$emit('close')" title="收起侧边栏">
          😼
        </button>
        <div class="app-text">
          <h1 class="app-name">{{ themeTexts.appName }}</h1>
          <p class="app-subtitle">{{ themeTexts.appSubtitle }}</p>
        </div>
      </div>
    </div>

    <!-- 新建对话按钮 -->
    <el-button
      type="primary"
      class="new-chat-btn"
      @click="handleNewChat"
      :icon="Plus"
      size="large"
    >
      新建对话
    </el-button>

    <!-- 对话历史列表 -->
    <div class="conversations-list">
      <el-menu
        :default-active="activeConversationId || ''"
        class="history-menu"
        @select="switchConversation"
      >
        <!-- 今天的对话 -->
        <template v-if="groupedConversations.today.length > 0">
          <el-menu-item
            v-for="conversation in groupedConversations.today"
            :key="conversation.id"
            :index="conversation.id"
            class="conversation-menu-item"
          >
            <template #title>
              <div class="conversation-item-content">
                <el-icon class="conversation-icon"><ChatDotRound /></el-icon>
                <div class="conversation-info">
                  <span class="conversation-title">{{ conversation.title }}</span>
                  <span class="conversation-time">刚刚</span>
                </div>
                <el-button
                  class="delete-btn"
                  :icon="Delete"
                  circle
                  size="small"
                  text
                  @click.stop="deleteConversation(conversation.id)"
                />
              </div>
            </template>
          </el-menu-item>
        </template>

        <!-- 昨天的对话 -->
        <template v-if="groupedConversations.yesterday.length > 0">
          <div class="time-divider">昨天</div>
          <el-menu-item
            v-for="conversation in groupedConversations.yesterday"
            :key="conversation.id"
            :index="conversation.id"
            class="conversation-menu-item"
          >
            <template #title>
              <div class="conversation-item-content">
                <el-icon class="conversation-icon"><ChatDotRound /></el-icon>
                <div class="conversation-info">
                  <span class="conversation-title">{{ conversation.title }}</span>
                  <span class="conversation-time">昨天</span>
                </div>
                <el-button
                  class="delete-btn"
                  :icon="Delete"
                  circle
                  size="small"
                  text
                  @click.stop="deleteConversation(conversation.id)"
                />
              </div>
            </template>
          </el-menu-item>
        </template>

        <!-- 更早的对话 -->
        <template v-if="groupedConversations.older.length > 0">
          <div class="time-divider">更早</div>
          <el-menu-item
            v-for="conversation in groupedConversations.older"
            :key="conversation.id"
            :index="conversation.id"
            class="conversation-menu-item"
          >
            <template #title>
              <div class="conversation-item-content">
                <el-icon class="conversation-icon"><ChatDotRound /></el-icon>
                <div class="conversation-info">
                  <span class="conversation-title">{{ conversation.title }}</span>
                  <span class="conversation-time">{{ formatDate(conversation.updatedAt) }}</span>
                </div>
                <el-button
                  class="delete-btn"
                  :icon="Delete"
                  circle
                  size="small"
                  text
                  @click.stop="deleteConversation(conversation.id)"
                />
              </div>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- 底部功能区 -->
    <div class="sidebar-footer">
      <!-- 主题切换 -->
      <div class="theme-toggle-container">
        <el-icon class="theme-icon">
          <component :is="mode === 'evil' ? Moon : Sunny" />
        </el-icon>
        <div class="theme-info">
          <span class="theme-label">{{ themeTexts.switchButton }}</span>
          <span class="theme-hint">{{ themeTexts.switchHint }}</span>
        </div>
        <el-switch
          v-model="isDarkMode"
          @change="toggleTheme"
          size="large"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
        />
      </div>

      <!-- 设置按钮 -->
      <el-button class="footer-btn" :icon="Setting" text>
        设置
      </el-button>

      <!-- 关于按钮 -->
      <el-button class="footer-btn" :icon="InfoFilled" text>
        关于我
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useChatStore } from '@/stores/chat'
import { 
  Plus, 
  ChatDotRound, 
  Delete, 
  Moon, 
  Sunny, 
  Setting, 
  InfoFilled 
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

defineEmits<{
  close: []
}>()

const themeStore = useThemeStore()
const chatStore = useChatStore()

const { mode, themeTexts } = storeToRefs(themeStore)
const { conversations, activeConversationId } = storeToRefs(chatStore)

// 暗黑模式开关状态
const isDarkMode = computed({
  get: () => mode.value === 'evil',
  set: () => {} // 由 toggleTheme 处理
})

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 新建对话
const handleNewChat = () => {
  chatStore.createConversation()
}

// 切换对话
const switchConversation = (id: string) => {
  chatStore.switchConversation(id)
}

// 删除对话
const deleteConversation = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个对话吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    chatStore.deleteConversation(id)
  } catch {
    // 用户取消删除
  }
}

// 按时间分组对话
const groupedConversations = computed(() => {
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000
  
  return {
    today: conversations.value.filter(c => now - c.updatedAt < oneDayMs),
    yesterday: conversations.value.filter(c => {
      const diff = now - c.updatedAt
      return diff >= oneDayMs && diff < 2 * oneDayMs
    }),
    older: conversations.value.filter(c => now - c.updatedAt >= 2 * oneDayMs)
  }
})

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped lang="scss">
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
  background-color: var(--el-bg-color-overlay);
}

.sidebar-header {
  flex-shrink: 0;
}

.app-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.app-icon {
  font-size: 32px;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: transform var(--transition-fast), background-color var(--transition-fast);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 769px) {
    cursor: default;
    pointer-events: none;
    
    &:hover {
      background-color: transparent;
      transform: none;
    }
  }
}

.app-text {
  flex: 1;
}

.app-name {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--el-text-color-primary);
}

.app-subtitle {
  font-size: var(--font-sm);
  color: var(--el-text-color-secondary);
}

// Element Plus 按钮定制
.new-chat-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-md);
  font-weight: 500;
  border-radius: var(--el-border-radius-base);
  flex-shrink: 0;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  margin: 0 calc(var(--spacing-md) * -1);
  padding: 0 var(--spacing-md);
}

// Element Plus Menu 定制
.history-menu {
  border: none;
  background-color: transparent;

  :deep(.el-menu-item) {
    height: auto;
    line-height: 1.5;
    padding: 0;
    margin-bottom: var(--spacing-sm);
    border-radius: var(--el-border-radius-base);
    
    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.is-active {
      background-color: var(--el-fill-color);
      border-left: 3px solid var(--el-color-primary);
    }
  }
}

.conversation-menu-item {
  :deep(.el-menu-item__title) {
    width: 100%;
  }
}

.conversation-item-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  width: 100%;
}

.conversation-icon {
  font-size: 20px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

.conversation-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.conversation-title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: var(--font-xs);
  color: var(--el-text-color-secondary);
}

.delete-btn {
  opacity: 0;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;

  .conversation-menu-item:hover & {
    opacity: 1;
  }
}

.time-divider {
  font-size: var(--font-xs);
  color: var(--el-text-color-secondary);
  padding: var(--spacing-md) var(--spacing-sm) var(--spacing-xs);
  font-weight: 500;
}

.sidebar-footer {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--el-border-color);
}

.theme-toggle-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}

.theme-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.theme-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.theme-label {
  font-weight: 500;
  font-size: var(--font-md);
  color: var(--el-text-color-primary);
}

.theme-hint {
  font-size: var(--font-xs);
  color: var(--el-text-color-secondary);
}

.footer-btn {
  width: 100%;
  justify-content: flex-start;
  height: 40px;
  font-size: var(--font-md);
}
</style>
