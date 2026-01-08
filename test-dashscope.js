// 测试阿里云百炼 API
// 使用方法: node test-dashscope.js

const apiKey = process.env.VITE_DASHSCOPE_API_KEY || 'sk-your-api-key-here'
const baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
const model = 'glm-4.7'

async function testAPI() {
  console.log('🔍 测试阿里云百炼 API...\n')
  console.log('配置信息:')
  console.log('- API Key:', apiKey.substring(0, 10) + '...')
  console.log('- 模型:', model)
  console.log('- 基础 URL:', baseURL)
  console.log('\n' + '='.repeat(50) + '\n')

  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: '你好，请简单介绍一下你自己' }
        ],
        stream: true,
        enable_thinking: true,
        stream_options: {
          include_usage: true
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    console.log('✅ API 连接成功！\n')
    console.log('='.repeat(20) + ' 思考过程 ' + '='.repeat(20) + '\n')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let isAnswering = false
    let reasoningContent = ''
    let answerContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        
        if (!trimmedLine || trimmedLine.startsWith(':')) continue

        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim()
          
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            
            // Token 使用情况
            if (parsed.usage) {
              console.log('\n' + '='.repeat(20) + ' Token 使用 ' + '='.repeat(20) + '\n')
              console.log('提示 tokens:', parsed.usage.prompt_tokens)
              console.log('回复 tokens:', parsed.usage.completion_tokens)
              console.log('总计 tokens:', parsed.usage.total_tokens)
              continue
            }

            if (!parsed.choices?.length) continue

            const delta = parsed.choices[0].delta

            // 思考内容
            if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
              if (!isAnswering) {
                process.stdout.write(delta.reasoning_content)
              }
              reasoningContent += delta.reasoning_content
            }

            // 回复内容
            if (delta.content !== undefined && delta.content) {
              if (!isAnswering) {
                console.log('\n\n' + '='.repeat(20) + ' AI 回复 ' + '='.repeat(20) + '\n')
                isAnswering = true
              }
              process.stdout.write(delta.content)
              answerContent += delta.content
            }
          } catch (e) {
            console.error('\n解析错误:', e.message)
          }
        }
      }
    }

    console.log('\n\n' + '='.repeat(50))
    console.log('\n✅ 测试完成！API 工作正常。\n')
    console.log('现在可以启动项目: npm run dev\n')

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    console.log('\n请检查:')
    console.log('1. API Key 是否正确')
    console.log('2. 网络连接是否正常')
    console.log('3. 是否已开通模型使用权限')
    console.log('\n详细配置请查看: DASHSCOPE_SETUP.md\n')
    process.exit(1)
  }
}

testAPI()
