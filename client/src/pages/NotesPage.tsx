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
  X
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
      addToast('Note deleted successfully.', 'info');
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
      addToast('Note saved!', 'success');
    } catch {
      addToast('Failed to create note.', 'error');
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Revision Knowledge Notebook</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.nav.notes}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            title="Format and print student formula revision sheet"
          >
            <span>🖨️ Print Revision Sheet</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Note</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setSubjectFilter('')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              subjectFilter === ''
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setSubjectFilter('math')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
              subjectFilter === 'math'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Math</span>
          </button>
          <button
            onClick={() => setSubjectFilter('physics')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
              subjectFilter === 'physics'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Atom className="h-3.5 w-3.5" />
            <span>Physics</span>
          </button>
          <button
            onClick={() => setSubjectFilter('chemistry')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
              subjectFilter === 'chemistry'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Chemistry</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or formulas..."
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 w-full sm:w-64"
          />
        </div>

      </div>

      {/* TWO COLUMN GRID: NOTES LIST & DETAIL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-md ring-1 ring-brand-500'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {note.subject}
                  </span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {note.contentMarkdown.replace(/[#*$`]/g, '')}
                </p>
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
              No saved notes found for this filter. Save explanations from the AI Tutor to access them offline!
            </div>
          )}
        </div>

        {/* Selected Note View with LaTeX Math Rendering */}
        {selectedNote && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {selectedNote.subject} Study Note
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedNote.title}
                </h2>
              </div>

              <button
                onClick={() => handleDelete(selectedNote.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Note"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Note Content with KaTeX */}
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              <MathRenderer content={selectedNote.contentMarkdown} />
            </div>

          </div>
        )}

      </div>

      {/* CREATE NEW NOTE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Create Custom Study Note</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Snell's Law & Refractive Index"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
                >
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content (Supports LaTeX e.g. $n = \frac{c}{v}$)
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  placeholder="Write your study notes and formulas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold"
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
