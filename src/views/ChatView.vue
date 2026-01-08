<template>
  <div class="chat-view">
    <!-- 头部 -->
    <header class="chat-header">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        ☰
      </button>
      <h2 class="chat-title">{{ activeConversation?.title || '新对话' }}</h2>
      <div class="header-spacer"></div>
    </header>

    <!-- 消息区域 -->
    <div class="messages-container" ref="messagesContainer">
      <!-- 空状态 -->
      <div v-if="!activeConversation || activeConversation.messages.length === 0" class="empty-state">
        <CatAvatar :mode="mode" />
        <h2 class="greeting">{{ themeTexts.greeting }}</h2>
        <p class="sub-greeting">{{ themeTexts.subGreeting }}</p>
        <p class="status">{{ themeTexts.status }}</p>

        <!-- 话题推荐 -->
        <div class="topics-section">
          <p class="topics-title">🎲 试试这些话题</p>
          <div class="topics-grid">
            <button
              v-for="topic in topics"
              :key="topic.id"
              class="topic-btn"
              @click="handleTopicClick(topic.text)"
            >
              {{ topic.text }}
            </button>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <MessageBubble
          v-for="message in activeConversation.messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <el-input
          v-model="inputText"
          type="textarea"
          :placeholder="themeTexts.placeholder"
          :autosize="{ minRows: 1, maxRows: 6 }"
          @keydown="handleKeyDown"
          resize="none"
          class="message-input"
        />
        <el-button
          type="primary"
          :icon="isLoading ? Loading : Promotion"
          circle
          size="large"
          :disabled="!inputText.trim() || isLoading"
          @click="handleSend"
          class="send-btn"
        />
      </div>
      <p class="input-hint">{{ themeTexts.sendHint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useChatStore } from '@/stores/chat'
import { Promotion, Loading } from '@element-plus/icons-vue'
import CatAvatar from '@/components/features/CatAvatar.vue'
import MessageBubble from '@/components/features/MessageBubble.vue'

defineEmits<{
  'toggle-sidebar': []
}>()

const themeStore = useThemeStore()
const chatStore = useChatStore()

const { mode, themeTexts } = storeToRefs(themeStore)
const { activeConversation, isLoading } = storeToRefs(chatStore)

// 输入文本
const inputText = ref('')
const messagesContainer = ref<HTMLDivElement>()

// 话题推荐
const topics = computed(() => {
  if (mode.value === 'evil') {
    return [
      { id: '1', text: '给我讲个笑话（但我不能笑）' },
      { id: '2', text: '我今天心情不好......' },
      { id: '3', text: '帮我吐槽一下生活' },
      { id: '4', text: '陪我聊聊天吧' }
    ]
  } else {
    return [
      { id: '1', text: '今天过得怎么样' },
      { id: '2', text: '给我个温暖的故事' },
      { id: '3', text: '聊聊你最近的想法' },
      { id: '4', text: '我想听听你的想法' }
    ]
  }
})

// 处理键盘事件
const handleKeyDown = (e: Event) => {
  const event = e as KeyboardEvent
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

// 发送消息
const handleSend = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const text = inputText.value
  inputText.value = ''

  await chatStore.sendMessage(text)
  scrollToBottom()
}

// 点击话题
const handleTopicClick = (text: string) => {
  inputText.value = text
  handleSend()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(
  () => activeConversation.value?.messages.length,
  () => {
    scrollToBottom()
  }
)
</script>

<style scoped lang="scss">
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-background);
}

.chat-header {
  height: var(--header-height);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.menu-btn {
  font-size: var(--font-xl);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.chat-title {
  font-size: var(--font-lg);
  font-weight: 600;
}

.header-spacer {
  flex: 1;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  animation: fadeIn var(--transition-normal);
}

.greeting {
  font-size: var(--font-xl);
  font-weight: 600;
  margin: var(--spacing-lg) 0 var(--spacing-sm);
}

.sub-greeting {
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-md);
  max-width: 400px;
}

.status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-xl);
}

.topics-section {
  width: 100%;
  max-width: 600px;
  margin-top: var(--spacing-xl);
}

.topics-title {
  font-size: var(--font-sm);
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-md);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.topic-btn {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: left;
  transition: all var(--transition-fast);

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.input-container {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.message-input {
  flex: 1;
  max-height: 200px;
  min-height: 24px;
  resize: none;
  overflow-y: auto;
  line-height: 1.5;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), #ff6b9d);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--transition-fast), opacity var(--transition-fast);

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
  }
}

.send-icon {
  font-size: var(--font-lg);
}

.input-hint {
  font-size: var(--font-xs);
  color: var(--color-textSecondary);
  margin-top: var(--spacing-sm);
  text-align: center;
}
</style>
