// app/(drawer)/create.tsx
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveNotes, loadNotes, Note } from '../../../utils/storage';
import { useNavigation } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { useFont } from '~/app/_layout';

const CreateNoteScreen = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();
  const addNote = async () => {
    // Allow empty content (text) but require title
    if (!title.trim()) return;
  
    const newNote: Note = {
      title: title.trim(),
      content: text.trim() || "", // Allow empty content if no text is entered
      createdAt: new Date().toISOString(),
  
    };
  
    // Load existing notes from AsyncStorage
    const existingNotes = await loadNotes();
  
    // Save the new note at the top of the list
    const updated = [newNote, ...existingNotes];
  
    // Save updated notes list back to AsyncStorage
    await saveNotes(updated);
  
    // Clear the title and text fields
    setTitle('');
    setText('');
  
    // Go back after saving the note
    navigation.goBack();
  };
  

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-2xl  mb-4 text-black dark:text-white"  style={{ fontFamily: `${font}-SemiBold` }}>Create a Draft</Text>
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
