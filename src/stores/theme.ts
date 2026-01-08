// 主题状态管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeMode, ThemeConfig } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题模式
  const mode = ref<ThemeMode>('evil')

  // 主题配置
  const themeConfigs: Record<ThemeMode, ThemeConfig> = {
    evil: {
      mode: 'evil',
      colors: {
        primary: '#E91E63',
        background: '#1a1a2e',
        surface: '#16213e',
        text: '#ffffff',
        textSecondary: '#a0a0a0',
        border: '#2d3561'
      }
    },
    gentle: {
      mode: 'gentle',
      colors: {
        primary: '#FF9800',
        background: '#fef6e4',
        surface: '#ffffff',
        text: '#333333',
        textSecondary: '#666666',
        border: '#e0e0e0'
      }
    }
  }

  // 当前主题配置
  const currentTheme = computed(() => themeConfigs[mode.value])

  // 主题文案配置
  const themeTexts = computed(() => {
    if (mode.value === 'evil') {
      return {
        appName: '邪恶小猫',
        appSubtitle: '坏但迷人',
        greeting: '哼，又是你啊',
        subGreeting: '有什么事就快说，本猫很忙的......(才怪)',
        status: '随时准备毒舌一下',
        placeholder: '有什么想吐槽的吗......🙄',
        sendHint: '按 Enter 发送，Shift + Enter 换行 · 别太期待我会温柔回复哦 😼',
        switchButton: '邪恶模式',
        switchHint: '切换回温柔模式'
      }
    } else {
      return {
        appName: '温柔助手',
        appSubtitle: 'AI 伴侣',
        greeting: '嗨，很高兴见到你',
        subGreeting: '我会用心倾听你的每一句话，陪你度过这段时光',
        status: '随时为你服务',
        placeholder: '和我说点什么吧......',
        sendHint: '按 Enter 发送，Shift + Enter 换行 · 我会认真倾听每一句话',
        switchButton: '温柔模式',
        switchHint: '切换到邪恶模式'
      }
    }
  })

  // 切换主题
  const toggleTheme = () => {
    mode.value = mode.value === 'evil' ? 'gentle' : 'evil'
    applyTheme()
    saveTheme()
  }

  // 应用主题到 CSS 变量
  const applyTheme = () => {
    const theme = currentTheme.value
    const root = document.documentElement
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    root.setAttribute('data-theme', mode.value)
    
    // Element Plus 暗黑模式支持
    if (mode.value === 'evil') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // 保存主题到本地存储
  const saveTheme = () => {
    localStorage.setItem('theme', mode.value)
  }

  // 从本地存储加载主题
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null
    if (savedTheme && (savedTheme === 'evil' || savedTheme === 'gentle')) {
      mode.value = savedTheme
    }
    applyTheme()
  }

  return {
    mode,
    currentTheme,
    themeTexts,
    toggleTheme,
    applyTheme,
    loadTheme
  }
})
