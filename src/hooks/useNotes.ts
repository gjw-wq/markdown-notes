import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Note } from '../types/note';
import { createNoteId, loadNotes, saveNotes } from '../utils/storage';
import { createSampleNotes } from '../data/sampleNotes';

/** 惰性初始化：读取 LocalStorage；首次使用（无数据）时种入示例笔记 */
function getInitialNotes(): Note[] {
  const stored = loadNotes();
  if (stored.length > 0) return stored;
  const seeded = createSampleNotes();
  saveNotes(seeded);
  return seeded;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(getInitialNotes);
  const [activeId, setActiveId] = useState('');
  const [keyword, setKeyword] = useState('');

  // 自动保存：notes 变化后 500ms 防抖写入 LocalStorage
  useEffect(() => {
    const timer = window.setTimeout(() => saveNotes(notes), 500);
    return () => window.clearTimeout(timer);
  }, [notes]);

  // 当前笔记：优先 activeId，删除当前笔记后回退到第一条
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId) ?? notes[0] ?? null,
    [notes, activeId]
  );

  const filteredNotes = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(trimmed));
  }, [notes, keyword]);

  const selectNote = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const createNote = useCallback(() => {
    const now = new Date().toISOString();
    const note: Note = {
      id: createNoteId(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now
    };
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setActiveId((current) => (current === id ? '' : current));
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note
        )
      );
    },
    []
  );

  return {
    filteredNotes,
    activeNote,
    keyword,
    setKeyword,
    selectNote,
    createNote,
    deleteNote,
    updateNote
  };
}
