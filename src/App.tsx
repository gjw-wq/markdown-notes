import { useState } from 'react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import NotePreview from './components/NotePreview';
import { useNotes } from './hooks/useNotes';

type ViewMode = 'edit' | 'preview';

export default function App() {
  const {
    filteredNotes,
    activeNote,
    keyword,
    setKeyword,
    selectNote,
    createNote,
    deleteNote,
    updateNote
  } = useNotes();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const activeId = activeNote?.id ?? '';

  const handleSelect = (id: string) => {
    selectNote(id);
    setSidebarOpen(false);
  };

  const handleCreate = () => {
    createNote();
    setSidebarOpen(false);
    setViewMode('edit');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 text-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 max-w-[85vw] bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          notes={filteredNotes}
          activeId={activeId}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={deleteNote}
        />
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-3 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
          >
            笔记列表
          </button>
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 text-sm ${
                viewMode === 'edit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-sm ${
                viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              预览
            </button>
          </div>
        </div>
        {activeNote ? (
          <div className="flex-1 flex min-h-0">
            <section
              className={`${
                viewMode === 'edit' ? 'flex' : 'hidden'
              } md:flex flex-1 min-w-0 md:w-1/2 bg-white`}
            >
              <NoteEditor
                note={activeNote}
                onChange={(patch) => updateNote(activeNote.id, patch)}
              />
            </section>
            <section
              className={`${
                viewMode === 'preview' ? 'flex' : 'hidden'
              } md:flex flex-1 min-w-0 md:w-1/2 bg-white border-l border-gray-200`}
            >
              <NotePreview content={activeNote.content} />
            </section>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-500">
            <p className="text-lg">暂无笔记</p>
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              新建笔记
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
