import type { Note } from '../types/note';

const STORAGE_KEY = 'markdown-notes-app';

/** 生成笔记唯一 ID，优先使用 crypto.randomUUID */
export function createNoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/** 从 LocalStorage 读取笔记列表，解析失败或结构异常时返回空数组 */
export function loadNotes(): Note[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : createNoteId(),
        title: typeof item.title === 'string' ? item.title : '',
        content: typeof item.content === 'string' ? item.content : '',
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString()
      }));
  } catch {
    return [];
  }
}

/** 将笔记列表写入 LocalStorage，写入失败（空间不足/隐私模式）时静默忽略 */
export function saveNotes(notes: Note[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // 忽略写入失败，避免打断编辑
  }
}
