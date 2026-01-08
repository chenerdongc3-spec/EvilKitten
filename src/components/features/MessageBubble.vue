<template>
  <div class="message-bubble" :class="`message-${message.role}`">
    <div v-if="message.role === 'assistant'" class="message-avatar">
      <CatAvatar :mode="themeStore.mode" size="small" />
    </div>
    
    <div class="message-content">
      <div class="message-text">
        {{ message.content }}
        <span v-if="message.isStreaming" class="typing-indicator">▋</span>
      </div>
      
      <!-- 思考内容（仅 AI 消息且有思考内容时显示） -->
      <ReasoningContent 
        v-if="message.role === 'assistant' && message.reasoningContent"
        :key="message.id"
        :content="message.reasoningContent"
      />
      
      <div class="message-time">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>

    <div v-if="message.role === 'user'" class="message-avatar user-avatar">
      👤
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types'
import { useThemeStore } from '@/stores/theme'
import CatAvatar from './CatAvatar.vue'
import ReasoningContent from './ReasoningContent.vue'

interface Props {
  message: Message
}

defineProps<Props>()

const themeStore = useThemeStore()

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped lang="scss">
.message-bubble {
  display: flex;
  gap: var(--spacing-md);
  animation: slideUp var(--transition-normal);

  &.message-user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-text {
      background: linear-gradient(135deg, var(--color-primary), #ff6b9d);
      color: white;
    }
  }

  &.message-assistant {
    .message-text {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
    }
  }
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &.user-avatar {
    background: linear-gradient(135deg, #667eea, #764ba2);
    font-size: var(--font-lg);
  }

  :deep(.avatar-circle) {
    width: 40px;
    height: 40px;
  }

  :deep(.cat-emoji) {
    font-size: 24px;
  }
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-width: 70%;

  @media (max-width: 768px) {
    max-width: 80%;
  }
}

.message-text {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  line-height: 1.6;
  word-wrap: break-word;
  position: relative;
}

.typing-indicator {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.message-time {
  font-size: var(--font-xs);
  color: var(--color-textSecondary);
  padding: 0 var(--spacing-sm);
}
</style>
