import type { KeyboardEvent } from 'react';
import type { Note } from '../types/note';

interface NoteEditorProps {
  note: Note;
  onChange: (patch: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

export default function NoteEditor({ note, onChange }: NoteEditorProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // Tab：插入两个空格，不切换焦点
    if (event.key === 'Tab') {
      event.preventDefault();
      const next = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
      onChange({ content: next });
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      });
      return;
    }

    // Ctrl+B / Cmd+B：用 ** 包裹选中文字并保留选区
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      const selected = value.slice(selectionStart, selectionEnd);
      const next =
        value.slice(0, selectionStart) + '**' + selected + '**' + value.slice(selectionEnd);
      onChange({ content: next });
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 2;
        textarea.selectionEnd = selectionStart + 2 + selected.length;
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <input
        type="text"
        value={note.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="输入笔记标题"
        className="w-full px-5 py-3 text-lg font-semibold text-gray-900 border-b border-gray-200 outline-none focus:bg-blue-50/40"
      />
      <textarea
        value={note.content}
        onChange={(event) => onChange({ content: event.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="在这里输入 Markdown 内容，右侧实时预览"
        spellCheck={false}
        className="flex-1 w-full px-5 py-4 font-mono text-sm leading-6 text-gray-800 resize-none outline-none"
      />
      <div className="px-5 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50">
        Tab 插入两个空格 · Ctrl+B 加粗选中文字 · 自动保存
      </div>
    </div>
  );
}
