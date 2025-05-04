import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

const NOTES_KEY = 'NOTES_STORAGE';

export const saveNotes = async (notes: Note[]) => {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const loadNotes = async (): Promise<Note[]> => {
  const data = await AsyncStorage.getItem(NOTES_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateNote = async (index: number, updatedNote: Note) => {
  const notes = await loadNotes();
  notes[index] = {
    ...notes[index],
    ...updatedNote,
    updatedAt: new Date().toISOString(),
  };
  await saveNotes(notes);
};

export const deleteNote = async (index: number) => {
  const notes = await loadNotes();
  notes.splice(index, 1);
  await saveNotes(notes);
};
