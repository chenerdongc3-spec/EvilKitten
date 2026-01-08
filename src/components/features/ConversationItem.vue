<template>
  <div 
    class="conversation-item"
    :class="{ active: isActive }"
    @click="$emit('click')"
  >
    <div class="conversation-content">
      <div class="conversation-icon">💬</div>
      <div class="conversation-info">
        <h3 class="conversation-title">{{ conversation.title }}</h3>
        <p class="conversation-time">{{ timeLabel }}</p>
      </div>
    </div>
    <button 
      class="delete-btn"
      @click.stop="handleDelete"
      title="删除对话"
    >
      🗑️
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '@/types'

interface Props {
  conversation: Conversation
  isActive: boolean
  timeLabel: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
  delete: []
}>()

const handleDelete = () => {
  if (confirm('确定要删除这个对话吗？')) {
    emit('delete')
  }
}
</script>

<style scoped lang="scss">
.conversation-item {
  padding: var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);

    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.12);
    border-left: 3px solid var(--color-primary);
  }
}

.conversation-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

.conversation-icon {
  font-size: var(--font-lg);
  flex-shrink: 0;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  font-size: var(--font-md);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-time {
  font-size: var(--font-xs);
  color: var(--color-textSecondary);
}

.delete-btn {
  opacity: 0;
  font-size: var(--font-md);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 0, 0, 0.2);
  }
}
</style>
