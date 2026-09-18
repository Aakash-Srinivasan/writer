import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  pinned?: boolean;
}

const NOTES_KEY = 'NOTES_STORAGE';
const DRAFT_IN_PROGRESS_KEY = 'DRAFT_IN_PROGRESS';
const SORT_PREFERENCE_KEY = 'NOTES_SORT_PREFERENCE';

export type SortOption = 'newest' | 'oldest' | 'alphabetical';

// Simple, dependency-free unique id generator (timestamp + random suffix).
export const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn('Failed to save notes to storage.', error);
    throw new Error('Could not save your notes. Please try again.');
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data) as Partial<Note>[];

    // Migrate any legacy notes that were stored without a unique id.
    let needsMigration = false;
    const migrated: Note[] = parsed.map((note) => {
      if (note.id) {
        return note as Note;
      }
      needsMigration = true;
      return {
        id: generateId(),
        title: note.title ?? '',
        content: note.content ?? '',
        createdAt: note.createdAt ?? new Date().toISOString(),
        updatedAt: note.updatedAt,
      };
    });

    if (needsMigration) {
      try {
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(migrated));
      } catch (error) {
        console.warn('Failed to persist migrated note ids.', error);
      }
    }

    return migrated;
  } catch (error) {
    console.warn('Failed to load notes from storage.', error);
    return [];
  }
};

export const updateNote = async (id: string, updatedNote: Partial<Note>): Promise<void> => {
  try {
    const notes = await loadNotes();
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      console.warn(`updateNote: no note found with id ${id}`);
      return;
    }
    notes[index] = {
      ...notes[index],
      ...updatedNote,
      id: notes[index].id,
      updatedAt: new Date().toISOString(),
    };
    await saveNotes(notes);
  } catch (error) {
    console.warn('Failed to update note.', error);
    throw new Error('Could not update this note. Please try again.');
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    const notes = await loadNotes();
    const filtered = notes.filter((note) => note.id !== id);
    await saveNotes(filtered);
  } catch (error) {
    console.warn('Failed to delete note.', error);
    throw new Error('Could not delete this note. Please try again.');
  }
};

export const togglePinNote = async (id: string): Promise<void> => {
  try {
    const notes = await loadNotes();
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) {
      console.warn(`togglePinNote: no note found with id ${id}`);
      return;
    }
    notes[index] = { ...notes[index], pinned: !notes[index].pinned };
    await saveNotes(notes);
  } catch (error) {
    console.warn('Failed to toggle pin.', error);
    throw new Error('Could not update this note. Please try again.');
  }
};

// -----------------------
// In-progress draft (Create screen autosave)
// -----------------------
// Protects against losing unsaved text if the app backgrounds or the user
// navigates away mid-write - separate from the saved-notes list itself.

export type DraftInProgress = { title: string; content: string };

export const saveDraftInProgress = async (draft: DraftInProgress): Promise<void> => {
  try {
    if (!draft.title.trim() && !draft.content.trim()) {
      await AsyncStorage.removeItem(DRAFT_IN_PROGRESS_KEY);
      return;
    }
    await AsyncStorage.setItem(DRAFT_IN_PROGRESS_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn('Failed to autosave draft in progress.', error);
  }
};

export const loadDraftInProgress = async (): Promise<DraftInProgress | null> => {
  try {
    const data = await AsyncStorage.getItem(DRAFT_IN_PROGRESS_KEY);
    return data ? (JSON.parse(data) as DraftInProgress) : null;
  } catch (error) {
    console.warn('Failed to load autosaved draft.', error);
    return null;
  }
};

export const clearDraftInProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DRAFT_IN_PROGRESS_KEY);
  } catch (error) {
    console.warn('Failed to clear autosaved draft.', error);
  }
};

// -----------------------
// Sort preference
// -----------------------

export const getSortPreference = async (): Promise<SortOption> => {
  try {
    const value = await AsyncStorage.getItem(SORT_PREFERENCE_KEY);
    if (value === 'newest' || value === 'oldest' || value === 'alphabetical') return value;
    return 'newest';
  } catch (error) {
    console.warn('Failed to load sort preference.', error);
    return 'newest';
  }
};

export const setSortPreference = async (sort: SortOption): Promise<void> => {
  try {
    await AsyncStorage.setItem(SORT_PREFERENCE_KEY, sort);
  } catch (error) {
    console.warn('Failed to persist sort preference.', error);
  }
};
