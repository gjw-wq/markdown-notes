import type { MouseEvent } from 'react';
import type { Note } from '../types/note';
import { formatDateTime } from '../utils/format';

interface SidebarProps {
  notes: Note[];
  activeId: string;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  notes,
  activeId,
  keyword,
  onKeywordChange,
  onSelect,
  onCreate,
  onDelete
}: SidebarProps) {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>, note: Note) => {
    event.stopPropagation();
    if (window.confirm(`确定删除「${note.title || '无标题笔记'}」吗？`)) {
      onDelete(note.id);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className="text-base font-bold text-gray-900">Markdown 笔记</h1>
        <button
          type="button"
          onClick={onCreate}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          新建笔记
        </button>
      </div>
      <div className="px-3 py-2">
        <input
          type="text"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="搜索笔记标题"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {notes.length === 0 ? (
          <p className="px-2 py-6 text-sm text-gray-400 text-center">没有找到笔记</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(note.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSelect(note.id);
              }}
              className={`group rounded-lg px-3 py-2 cursor-pointer ${
                activeId === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-gray-800">
                  {note.title || '无标题笔记'}
                </p>
                <button
                  type="button"
                  onClick={(event) => handleDelete(event, note)}
                  className="shrink-0 text-xs text-gray-300 hover:text-red-500 group-hover:text-gray-400"
                >
                  删除
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">{formatDateTime(note.updatedAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
