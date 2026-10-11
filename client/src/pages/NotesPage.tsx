import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  Pin,
  Calculator,
  Atom,
  FlaskConical,
  Plus,
  X,
  Printer,
  Sparkles,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { getSavedNotes, deleteNote, saveNote } from '../api/client.js';
import { SavedNote } from '../types/index.js';
import { MathRenderer } from '../components/MathRenderer.js';

export const NotesPage: React.FC = () => {
  const { t, addToast } = useApp();
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<SavedNote | null>(null);

  // New Note Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'math' | 'physics' | 'chemistry'>('math');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, [subjectFilter]);

  const loadNotes = () => {
    getSavedNotes(subjectFilter || undefined).then((data) => {
      setNotes(data);
      if (data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    }).catch(() => {});
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(notes.find((n) => n.id !== id) || null);
      }
      addToast('Note removed from notebook.', 'info');
    } catch {
      addToast('Failed to delete note.', 'error');
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const created = await saveNote({
        title: newTitle,
        subject: newSubject,
        contentMarkdown: newContent,
      });
      setNotes((prev) => [created, ...prev]);
      setSelectedNote(created);
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
      addToast('Revision note saved successfully!', 'success');
    } catch {
      addToast('Failed to create note.', 'error');
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-mono font-semibold">
            <Bookmark className="h-3.5 w-3.5 text-cyan-400" />
            <span>Formulas & Pedagogical Notebook</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Student Research &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Formula Archive
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl console-card border border-white/15 hover:border-white/30 text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            title="Format and print student formula revision sheet"
          >
            <Printer className="h-3.5 w-3.5 text-slate-400" />
            <span>Print Cheat Sheet</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Note</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <button
            onClick={() => setSubjectFilter('')}
            className={`px-3.5 py-2 rounded-xl transition-all font-mono text-xs shrink-0 ${
              subjectFilter === ''
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setSubjectFilter('math')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs shrink-0 ${
              subjectFilter === 'math'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Math</span>
          </button>
          <button
            onClick={() => setSubjectFilter('physics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs shrink-0 ${
              subjectFilter === 'physics'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>Physics</span>
          </button>
          <button
            onClick={() => setSubjectFilter('chemistry')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-mono text-xs shrink-0 ${
              subjectFilter === 'chemistry'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/25'
                : 'console-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Chemistry</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter formulas, theorems, concepts..."
            className="pl-10 pr-4 py-2.5 text-xs rounded-xl border border-white/15 bg-slate-950/80 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-72 shadow-inner"
          />
        </div>

      </div>

      {/* TWO COLUMN GRID: NOTES LIST & DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Notes List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'console-card-elevated border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'console-card border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    note.subject === 'math'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                      : note.subject === 'physics'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                  }`}>
                    {note.subject}
                  </span>
                  <span className="text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white font-display mt-2">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {note.contentMarkdown.replace(/[#*$`]/g, '')}
                </p>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="p-12 text-center text-slate-400 console-card border-dashed border-white/15 rounded-3xl text-xs space-y-2">
              <FileText className="h-6 w-6 text-slate-500 mx-auto" />
              <p className="font-semibold text-slate-300">No notes found matching this filter.</p>
              <p className="text-[11px] text-slate-500">Save explanations from the Socratic Tutor or click "Add Custom Note".</p>
            </div>
          )}
        </div>

        {/* Selected Note View with LaTeX Math Rendering */}
        {selectedNote && (
          <div className="lg:col-span-7 console-card-elevated rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  {selectedNote.subject.toUpperCase()} Revision Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                  {selectedNote.title}
                </h2>
              </div>

              <button
                onClick={() => handleDelete(selectedNote.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/30 hover:border-rose-500 transition-all shrink-0"
                title="Delete Note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Note Content with KaTeX */}
            <div className="text-sm text-slate-200 leading-relaxed space-y-4">
              <MathRenderer math={selectedNote.contentMarkdown} displayMode={false} />
            </div>

          </div>
        )}

      </div>

      {/* CREATE NEW NOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="console-card-elevated rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl border border-white/15">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white font-display">Create Custom Revision Note</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[10px] uppercase font-bold text-slate-300 mb-1.5">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Quadratic Formula Derivation & Discriminant Rules"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-slate-950 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase font-bold text-slate-300 mb-1.5">
                  Subject Category
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-slate-950 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase font-bold text-slate-300 mb-1.5">
                  Content (Supports LaTeX Math e.g. $$x = \frac&#123;-b&#125;&#123;2a&#125;$$)
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write formulas, summary theorems, and notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-slate-950 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
