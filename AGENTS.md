# Markdown 笔记应用 AI 开发指令（AGENTS.md）

## 项目概述

使用 React + TypeScript + react-markdown + Tailwind CSS 开发的本地 Markdown 笔记应用，笔记数据保存在 LocalStorage。

## 开发环境

- 操作系统：Windows
- 包管理器：npm
- 命令一律使用 Windows 兼容写法
- 不在交付阶段执行 npm install / dev server（离线交付），但必须保证 `npm install && npm run dev` 可直接运行

## 开发规范

- TypeScript 开启 strict、noUnusedLocals、noUnusedParameters，不留 any
- 组件一律函数式组件 + Hooks，默认导出，命名 PascalCase
- 领域状态集中在 hooks/useNotes.ts，组件不直接操作 LocalStorage
- LocalStorage 读写只允许出现在 utils/storage.ts
- 样式优先使用 Tailwind 原子类；Markdown 渲染细节样式集中在 index.css 的 .markdown-body 规则下
- 界面文案全部中文；代码与配置中的引号一律 ASCII 直引号
- 不使用 TODO / FIXME / 占位符，不允许假数据、假 URL、空实现
- 依赖版本以 package.json 为准，不擅自升级大版本

## 代码风格

- 组件文件名 PascalCase，工具函数 camelCase，类型/接口 PascalCase
- 常量使用 UPPER_SNAKE_CASE（如 STORAGE_KEY）
- react-markdown 的组件覆写写在 NotePreview.tsx 内，不外泄渲染配置
- 删除笔记必须 window.confirm 二次确认

## 测试要求

- 每个功能完成后手动验证：
  1. 首次打开出现 2 条示例笔记，预览正常渲染（标题/表格/任务列表/代码高亮）
  2. 编辑内容 500ms 后刷新页面，修改仍在
  3. 新建 → 输入 → 切换 → 删除（当前笔记删除后自动切换）
  4. 搜索标题即时过滤，清空搜索恢复
  5. textarea 内 Tab 插入两个空格不丢焦点；选中文字 Ctrl+B 变为加粗且选区保留
  6. 窗口缩到移动宽度：列表变抽屉、编辑/预览可切换

## 注意事项

- 保持代码简洁，不为单一用途抽象组件
- 编辑器快捷键只绑定在 textarea 上，不影响全局输入
- 预览渲染使用纯函数组件，避免不必要的 memo 复杂化
- 修改范围严格限定在指定文件，不顺手重构其他模块
