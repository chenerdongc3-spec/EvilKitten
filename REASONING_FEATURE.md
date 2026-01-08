例。
个典型案，是前端性能优化的一问题的渲染理大量数据目中处 项如何在 Vue 3能展示了展

这个功计，易于扩**：模块化设的可维护性. **更好清晰
4辑更和回复分离，逻*更清晰的结构**：思考 *
3.内容很长也能流畅显示即使思考能**： **更高的性的思考过程
2.可以选择查看 AI 用户的用户体验**：. **更好：

1，我们实现了显示和虚拟列表渲染分离

通过实现思考内容的# 总结api)

#by-calling--qwen-ence/useoper-refereveldio/dtuh/model-saliyun.com/zelp./hhttps:/ 文档](PI
- [阿里云百炼 Ace.html)performanractices/t-pg/guide/bess.oruejhttps://v能优化](3 性/)
- [Vue indow-react-we-long-listsalizdev/virtu//web.s:](http

- [虚拟列表原理关文档按钮

## 相"思考开始/结束跳转到 ] 添加"示高度
- [ 支持调整思考内容的显 ] [
-进度指示内容的[ ] 添加思考- 验
 3. 用户体
###
虚拟列表的懒加载策略
- [ ] 添加verscan ] 实现更智能的 o
- [ er 处理大文本分割Work [ ] 使用 Web 2. 性能优化
-# 容的语法高亮

## ] 添加思考内
- [导出思考过程
- [ ] 支持内容 支持复制思考
- [ ] 支持搜索思考内容 [ ]. 功能增强
-向

### 1# 未来优化方
```

#正常占用动流畅
3. 内存面不卡顿
2. 滚检查：
1. 页考内容
0+ 行思AI 生成 500`
场景：测试
``## 4. 性能
#
```
干扰 两者互不始显示回复
3.成后开实时累加
2. 思考完考内容
1. 思
观察：``收测试
` 流式接``

### 3.流畅滚动
`很长，虚拟列表思考内容的原理
预期：：请详细分析一下量子计算
```
用户 长文本测试 2.``

###接展开查看
`容较短，可以直你好
预期：思考内用户：测试
```
## 1. 短文本试建议

#思考过程

## 测查看历史
- 刷新页面后可以lStorage到 loca会保存考内容也
- 思### 3. 本地存储高效更新

式系统 利用 Vue 的响应换
-对象的替
- 避免整个消息 分别更新ge`ateMessaupd和 `gContent` onineReasatpd
- 使用 `u. 流式更新### 2渲染

- 避免不必要的重新存计算结果
puted` 缓 使用 `com点
- DOM 节 只渲染可见内容，减少1. 虚拟列表
-### 
## 性能优化

 高亮效果
Hover
- x
- 每行底部细边框高度 24p拟列表项
- 固定
### 虚Hover 效果
头向上）
- 时箭转动画（展开 显示行数统计
- 旋 折叠按钮
-义滚动条

###- 自定Consolas）
nlo, naco, Me
- 等宽字体（Mo线边框分隔）
- 虚 0, 0, 0.2)``rgba(0,色背景（ 深器
-容容计

### 思考内## 样式设}))
```

t}px`
emHeigh italue *ndex.v${startI: ` paddingTop,
 alue}px`talHeight.vight: `${to
  he({(() => e = computedcontentStyl位
const Top 占padding
// 使用 t
})
ul resturn }
  ree[i] })
 lus.vatem idata: i, dex:.push({ inltsure
     {alue; i++)dex.vndIn= ealue; i <.vexstartInd i = 
  for (letlt = []su
  const re(() => {s = computedemItnst visible
co可见项

// 只渲染 2
  )
})erscan *nt + ovCouue + visible.valndex
    startI.length - 1,valuetems.   imin(
 ath.rn Mtu
  reitemHeight)eight / rHntaineil(co = Math.cesibleCountconst vi{
   => ed(()utmpdIndex = const en

corscan)
})oveight) - / itemHeue lTop.valoor(scrolath.fl0, MMath.max({
  return puted(() => Index = comt startns
co
// 计算可见区域escript

```typ

### 关键代码未渲染内容）
```动计算（模拟下方ottom = 自ngBpaddi渲染内容）
  × 24px（模拟上方未 = 起始索引 op  paddingT 
占位处理：
行
 0 ≈ 2行数 渲染verscan）
  13 + 6（o = 起始索引 + 束索引  结scan）
 3（over -p / 24)r(scrollToh.floo = Mat起始索引
实际渲染：
   行
   / 24 ≈ 1300数 = 300px
  可见行 = 3 容器高度
 区域：
可见120000px
× 24px = 高度 = 5000 行 
总现原理

```### 实，流畅滚动

区域） 个 DOM 节点（可见渲染约 20**：只**使用虚拟列表存，滚动卡顿
- 占用大量内 节点，5000 个 DOM用虚拟列表**：渲染 ：
- **不使过程有 5000 行设 AI 的思考？

假为什么需要虚拟列表

### 问题：## 虚拟列表原理详解``

─ 虚拟列表渲染
`      └─折叠
  t）- 可ontent（reasoningCsoningConten └── Rea 始终显示
 content）-  ├── 回复内容（ble
sageBubes`
M息
`` 显示消3.

### 
```效果）t → 实时更新（打字机encont加到 → 累unk onCh
回复阶段：
  → 实时更新
ent Contasoningnk → 累加到 rehuonReasoningC`
思考阶段：
   响应
``2. 接收 AI``

###  AI 消息
`用户消息 → 创建空的创建→ 用户输入 户发送消息
```
# 1. 用
### 使用流程

#
})
```
chunk)
  }ntent + sageId, coonId, mesversaticondateMessage( up => {
   (chunk)hunk: nC容
  o  // 接收回复内)
  },
nt + chunkasoningContegeId, red, messaonIt(conversatisoningContenpdateRea> {
    u (chunk) =unk:ReasoningCh接收思考内容
  on {
  // ge(messages,treamMessaice.sendSServashScopewait Dpt
aypescri``t*：
`接收处理*```

**流式思考内容
}
// 更新消息的> {
  ) =t: string
ontenreasoningC 
  Id: string,sageg, 
  messtrinId: ionatvers= (
  conntent ngCosonieat updateRonsypescript
c增方法**：
```ts）

**新tores/chat.t态管理更新（s 状`

### 5.>
``"false"
/anded=efaultExp"
  :d="300eight :maxH"
 Contentningeasoe.r="messag:content
  t"ngContene.reasoni"messagif=nt 
  v-ingConte
<Reason**：
```vue*使用示例部

*式接收时自动滚动到底行数统计
- 流文本
- 显示染长- 使用虚拟列表渲折叠/展开思考内容
- ：
）

**功能**tent.vueoneasoningC4. 思考内容组件（R关

### 总行数无- 内存占用和渲染时间与行
20 只渲染约 000 行文本：仍然可见区域）
- 10染约 20 行（：只渲 行文本
- 1000势**：
**性能优
新可见区域. 监听滚动事件，动态更拟未渲染内容的高度
4ddingTop` 模. 使用 `parscan）的内容
3域（ove区域 + 预渲染区. 只渲染可见的起始/结束索引
2滚动位置计算可见区域 根据
1.*：
**工作原理*
```
urn<T>alListRetirtu Vtions<T>):tOpalLisVirtuns: st<T>(optioeVirtualLition usxport funcript
e
```typesc功能**：s）

**核心ualList.tirt具（utils/v虚拟列表工# 3. 回复

##hunk` 回调传递最终 通过 `onC思考内容
-unk` 回调传递ingChson
- 通过 `onRea.content`ltaent` 和 `desoning_contealta.r
- 分别处理 `de*：
**关键改动*
}
```容片段回调
 // 思考内g) => void k: strinhununk?: (csoningCh {
  onReallbacksCaream Sts extendslbackeamCalExtendedStrinterface t xporypescript
e口**：
```t
**新增接
）rvice.tsScopeSePI 服务更新（Dash
### 2. A``

}
`新增：AI 思考过程// : string  tent?reasoningConn
  ooleareaming?: bSt  is number
tamp:mesg
  ti: strincontent
  e: MessageRololeg
  r
  id: strine {ssag Merfacet inteor
exppescripts）

```tyx.ts/inde型定义（type 类``

### 1.义（已更新）
`      # 类型定            index.ts  
    └── pes/ty（已更新）
└── 状态管理# 聊天                 ts     └── chat.s/
│  re├── stoPI 服务（已更新）
 A   #.ts      vicecopeSer  └── DashServices/
│ 
├── api/s泡（已更新）息气   # 消   e     ageBubble.vu   └── Mess示组件
│内容展     # 思考nt.vue   teoningConeas  ├── R│ res/
/featu components具
├── # 虚拟列表工           s  tualList.t└── vir  ils/
│ /
├── utcat-chat/src
```
evil-
## 文件结构

### 技术实现和结构化内容

体显示，便于阅读代码- 等宽字自定义滚动条样式

- 统计显示思考内容的行数开动画效果
- 
- 折叠/展用户体验优化### 3. 内容

加载见区域，动态畅滚动
- 自动计算可千行文本的流 支持数
-域的内容拟列表技术，只渲染可见区用虚列表渲染
- 使. 虚拟## 2示思考过程

#，实时显流式接收验
- 支持不影响阅读体开，折叠/展容可考内
- 思ntent`）分开处理和最终回复（`content`）asoning_coreAI 的思考过程（`考内容分离
- 
### 1. 思


## 核心特性效渲染长文本。虚拟列表技术高离显示，使用tent）与最终回复的分coning  思考过程（reason实现了 AI
## 功能概述
展示功能

考过程# AI 思