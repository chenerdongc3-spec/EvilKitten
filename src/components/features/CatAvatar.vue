<template>
  <div class="cat-avatar" :class="`cat-avatar-${mode}`">
    <div class="avatar-circle">
      <span class="cat-emoji">{{ catEmoji }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeMode } from '@/types'

interface Props {
  mode: ThemeMode
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large'
})

const catEmoji = computed(() => {
  return props.mode === 'evil' ? '😼' : '😺'
})
</script>

<style scoped lang="scss">
.cat-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.cat-avatar-evil .avatar-circle {
  background: linear-gradient(135deg, #E91E63, #9C27B0);
  box-shadow: 0 8px 24px rgba(233, 30, 99, 0.3);
}

.cat-avatar-gentle .avatar-circle {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.3);
}

.cat-emoji {
  font-size: 64px;
}
</style>
