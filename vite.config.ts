/**
 * Vite 配置文件
 * 
 * 配置了项目的构建、开发服务器、插件等
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    
    /**
     * 自动导入 Vue API
     * 
     * 无需手动导入 ref, computed, watch 等 Vue API
     * 自动生成类型声明文件: src/types/auto-imports.d.ts
     * 
     * @example
     * // ❌ 不需要这样写：
     * import { ref, computed } from 'vue'
     * 
     * // ✅ 可以直接使用：
     * const count = ref(0)
     * const double = computed(() => count.value * 2)
     */
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
    }),
    
    /**
     * 自动导入 Element Plus 组件
     * 
     * 无需手动导入 Element Plus 组件
     * 自动生成类型声明文件: src/types/components.d.ts
     * 
     * @example
     * // ❌ 不需要这样写：
     * import { ElButton, ElInput } from 'element-plus'
     * 
     * // ✅ 可以直接在模板中使用：
     * <el-button>按钮</el-button>
     * <el-input v-model="text" />
     */
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/components.d.ts',
    }),
  ],
  
  /**
   * 路径别名配置
   * 
   * @ 指向 src 目录
   * 
   * @example
   * import { useChatStore } from '@/stores/chat'
   * import type { Message } from '@/types'
   */
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  /**
   * 开发服务器配置
   */
  server: {
    // 代理配置（根据需要配置你的 AI 服务）
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   }
    // }
  },
  
  /**
   * 构建配置
   */
  build: {
    // 使用 esbuild 压缩（更快，避免 CSP 问题）
    minify: 'esbuild',
    // 不生成 source map（减小体积）
    sourcemap: false
  }
})
