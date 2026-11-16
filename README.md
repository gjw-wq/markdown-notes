# Markdown 笔记应用

一个基于 React + TypeScript + react-markdown 的本地 Markdown 笔记应用。左侧管理笔记列表（搜索、新建、删除、切换），右侧编辑并实时预览渲染效果，代码块带多语言语法高亮，数据自动保存在浏览器 LocalStorage。

## 功能特性

- 笔记管理：新建、删除（二次确认）、点击切换，列表显示标题与更新时间
- 按标题模糊搜索，即时过滤
- 桌面端左右分栏实时预览，移动端"编辑 / 预览"切换 + 笔记列表抽屉，自适应布局
- Markdown 渲染：react-markdown + remark-gfm，支持标题、强调、列表、任务列表、引用、链接、表格、删除线等
- 代码块语法高亮：react-syntax-highlighter（Prism 引擎，oneDark 主题），支持 JavaScript、TypeScript、Python、Bash 等多种语言
- 编辑快捷键：Tab 插入两个空格（不切焦点），Ctrl+B / Cmd+B 加粗选中文字并保留选区
- 自动保存：输入防抖 500ms 写入 LocalStorage，刷新页面数据不丢
- 首次使用自动创建 2 条示例笔记，完整展示 Markdown 各种语法

## 技术栈

- React ^18.3.1 + TypeScript ~5.6（strict 模式）
- Vite ^5.4
- react-markdown ^9 + remark-gfm ^4
- react-syntax-highlighter ^15.5（Prism）
- Tailwind CSS ^3.4（经典 v3 配置）

## 目录结构

```text
06-markdown-notes/
  RESEARCH.md             # 需求研究
  PRD.md                  # 产品需求文档
  TECH_DESIGN.md          # 技术设计文档
  AGENTS.md               # AI 开发指令
  README.md               # 项目说明
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  index.html
  .gitignore
  src/
    main.tsx              # 应用入口
    App.tsx               # 布局组装（分栏 / 抽屉 / 视图切换）
    index.css             # Tailwind 指令 + markdown-body 排版样式
    vite-env.d.ts         # Vite 客户端类型
    types/note.ts         # Note 数据模型
    utils/storage.ts      # LocalStorage 读写与 ID 生成
    utils/format.ts       # 更新时间格式化
    hooks/useNotes.ts     # 笔记状态管理与防抖持久化
    data/sampleNotes.ts   # 2 条示例笔记
    components/
      Sidebar.tsx         # 笔记列表（搜索、新建、删除、切换）
      NoteEditor.tsx      # 编辑器（标题 + 正文 + 快捷键）
      NotePreview.tsx     # Markdown 实时预览 + 代码高亮
```

## 启动步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产构建（可选）
npm run build
npm run preview
```

打开浏览器访问 http://localhost:5173 即可使用。

## 数据说明

笔记数据保存在浏览器 LocalStorage（键名 `markdown-notes-app`），仅存储在本地设备。清除浏览器数据将导致笔记丢失，请注意备份。首次打开会自动创建 2 条示例笔记供体验。
