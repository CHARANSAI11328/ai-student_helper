import { Router, Request, Response } from 'express';
import { DataStore, SavedNote } from '../services/dataStore.js';

export const notesRouter = Router();

// GET /api/notes - List saved notes
notesRouter.get('/', (req: Request, res: Response) => {
  const store = DataStore.getInstance();
  const subject = req.query.subject as string | undefined;

  let notes = store.savedNotes;
  if (subject) {
    notes = notes.filter(n => n.subject === subject);
  }

  return res.json({ success: true, notes });
});

// POST /api/notes - Save a new note
notesRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, subject, topicId, contentMarkdown, isPinned = false } = req.body;

    if (!title || !subject || !contentMarkdown) {
      return res.status(400).json({ error: 'Title, subject, and contentMarkdown are required.' });
    }

    const store = DataStore.getInstance();
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      studentId: store.profile.id,
      title,
      subject,
      topicId,
      contentMarkdown,
      isPinned: Boolean(isPinned),
      createdAt: new Date().toISOString()
    };

    store.addSavedNote(newNote);
    return res.json({ success: true, note: newNote });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save note.', details: err.message });
  }
});

// DELETE /api/notes/:id - Delete a note
notesRouter.delete('/:id', (req: Request, res: Response) => {
  const store = DataStore.getInstance();
  const id = req.params.id as string;
  store.deleteSavedNote(id);
  return res.json({ success: true, message: 'Note deleted successfully.' });
});
