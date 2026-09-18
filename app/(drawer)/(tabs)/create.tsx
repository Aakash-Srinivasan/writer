// app/(drawer)/(tabs)/create.tsx
import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../../context/ThemeContext';
import {
  saveNotes,
  loadNotes,
  generateId,
  Note,
  saveDraftInProgress,
  loadDraftInProgress,
  clearDraftInProgress,
} from '../../../utils/storage';

import { useFont } from '~/app/_layout';

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const CreateNoteScreen = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();

  // Restore any autosaved draft when the screen comes into focus (e.g. the
  // app was backgrounded mid-write, or the user switched tabs and came back)
  // - but only into empty fields, so it never clobbers text already being typed.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const draft = await loadDraftInProgress();
        if (isActive && draft && !title.trim() && !text.trim()) {
          setTitle(draft.title);
          setText(draft.content);
        }
      })();
      return () => {
        isActive = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-check on focus, not on every keystroke
    }, [])
  );

  // Debounced autosave: waits a beat after typing stops rather than writing
  // to AsyncStorage on every keystroke.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDraftInProgress({ title, content: text });
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, text]);

  const addNote = async () => {
    // Allow empty content (text) but require title
    if (!title.trim()) return;

    const newNote: Note = {
      id: generateId(),
      title: title.trim(),
      content: text.trim() || "", // Allow empty content if no text is entered
      createdAt: new Date().toISOString(),

    };

    try {
      // Load existing notes from AsyncStorage
      const existingNotes = await loadNotes();

      // Save the new note at the top of the list
      const updated = [newNote, ...existingNotes];

      // Save updated notes list back to AsyncStorage
      await saveNotes(updated);

      // Clear the title and text fields
      setTitle('');
      setText('');
      await clearDraftInProgress();

      // Go back after saving the note
      navigation.goBack();
    } catch (error) {
      console.warn('Failed to save new note.', error);
      Alert.alert('Save Failed', 'Something went wrong while saving your note. Please try again.');
    }
  };


  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-2xl  mb-4 text-black dark:text-white" style={{ fontFamily: `${font}-SemiBold` }}>Create a Draft</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title of Draft"
        placeholderTextColor={isLight ? '#6B7280' : '#9CA3AF'}
        className="text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3"
        style={{ fontFamily: `${font}-Medium` }}
      />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter your Thoughts...✨"
        placeholderTextColor={isLight ? '#6B7280' : '#9CA3AF'}
        multiline
        className="text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-40"
        style={{ fontFamily: `${font}-Medium`, textAlignVertical: 'top', }}
      />
      <Text
        className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1"
        style={{ fontFamily: `${font}-Regular` }}
      >
        {countWords(text)} words - {text.length} characters
      </Text>
      <TouchableOpacity
        onPress={addNote}
        className="mt-4 bg-blue-600 p-3 rounded-lg"
      >
        <Text className="text-white text-center " style={{ fontFamily: `${font}-SemiBold` }}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNoteScreen;
