# Markdown 笔记应用技术设计

## 技术栈

| 层次 | 选型 | 说明 |
| --- | --- | --- |
| 前端框架 | React ^18.3.1 + TypeScript ~5.6 | 函数式组件 + Hooks，strict 模式 |
| 构建工具 | Vite ^5.4 | 开发热更新、生产构建 |
| Markdown 渲染 | react-markdown ^9 | AST 渲染，组件可覆写 |
| GFM 扩展 | remark-gfm ^4 | 表格 / 任务列表 / 删除线 / 自动链接 |
| 代码高亮 | react-syntax-highlighter ^15.5 | Prism 引擎 + oneDark 主题 |
| 样式 | Tailwind CSS ^3.4 | 经典 v3 配置 + index.css 自定义 markdown-body 样式 |
| 数据存储 | LocalStorage | 手动封装读写（storage.ts），500ms 防抖 |

## 项目结构

```text
06-markdown-notes/
  src/
    components/
      Sidebar.tsx       # 笔记列表：搜索、新建、删除、切换
      NoteEditor.tsx    # 标题输入 + 正文 textarea（Tab / Ctrl+B 快捷键）
      NotePreview.tsx   # react-markdown + 语法高亮渲染
    hooks/
      useNotes.ts       # 笔记状态、增删改查、防抖持久化、搜索过滤
    data/
      sampleNotes.ts    # 首次使用的 2 条示例笔记
    types/
      note.ts           # Note 数据模型
    utils/
      storage.ts        # LocalStorage 读写（容错）+ ID 生成
      format.ts         # 更新时间格式化
    App.tsx / main.tsx / index.css / vite-env.d.ts
```

## 数据模型

### Note（笔记）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 唯一标识（crypto.randomUUID，降级方案） |
| title | string | 标题（可为空，列表回退"无标题笔记"） |
| content | string | Markdown 正文 |
| createdAt | string | 创建时间 ISO 字符串 |
| updatedAt | string | 最后更新时间 ISO 字符串（每次编辑刷新） |

LocalStorage 键名：`markdown-notes-app`，内容为 `Note[]` 的 JSON。

## 状态管理设计

不引入状态库，使用自定义 Hook `useNotes` 承载全部领域状态：

- `notes: Note[]`：全量笔记，`useState` 惰性初始化（读 LocalStorage，为空则种入示例）
- `activeId: string`：当前笔记 id；派生 `activeNote = notes.find(id) ?? notes[0]`（删除当前笔记后自动回退第一条）
- `keyword: string`：搜索词，`filteredNotes` 按标题过滤
- 动作：`selectNote / createNote / deleteNote / updateNote`
- 持久化：`useEffect` 监听 notes，500ms setTimeout 后 `saveNotes`，依赖变化时清理上一个定时器（天然防抖）

## 关键技术点

1. **实时预览**：textarea 受控于 notes 状态，输入即 setState，NotePreview 作为纯函数组件随渲染更新
2. **代码高亮**：覆写 react-markdown 的 `code` 组件；`className` 匹配 `language-(\w+)` 时交给 SyntaxHighlighter（Pretag="div" 避免 pre 嵌套），否则按行内代码渲染
3. **Tab 键**：preventDefault 后拼接两个空格，requestAnimationFrame 恢复光标到插入点之后
4. **Ctrl+B**：将选区包裹 `**`，恢复光标为原选区整体（`selectionStart+2 .. selectionStart+2+len`）
5. **移动端自适应**：Tailwind `md:` 断点——列表 fixed 抽屉 + 遮罩，主区域编辑/预览二选一；桌面静态分栏
6. **持久化容错**：loadNotes 解析失败/非数组/字段类型不符时返回空数组，由 useNotes 重新种入示例笔记
7. **markdown-body 样式**：index.css 内以 @apply 编写 h1-h4 / 列表 / 表格 / 引用 / 行内代码等规则，行内代码用 `:not([class*='language-'])` 排除高亮代码块
