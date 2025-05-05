import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteNote, loadNotes, updateNote, Note } from '../../../utils/storage';
import { useTheme } from '../../../context/ThemeContext';
import { Entypo } from '@expo/vector-icons';
import { useFont } from '~/app/_layout';


const NotesListScreen = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const fetchNotes = async () => {
    const data = await loadNotes();
    setNotes(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const openModal = (index: number) => {
    const note = notes[index];
    setSelectedNoteIndex(index);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedNoteIndex !== null) {
      const note = notes[selectedNoteIndex];
      if (!editedTitle.trim() && !editedContent.trim()) return; // allow title-only
  
      await updateNote(selectedNoteIndex, {
        title: editedTitle,
        content: editedContent,
        createdAt: note.createdAt,
        updatedAt: new Date().toISOString()
      });
  
      await fetchNotes();
      setModalVisible(false);
    }
  };
  
  const confirmDelete = () => {
    setShowConfirmDelete(true);
  };
  
  const handleDeleteConfirmed = async () => {
    if (selectedNoteIndex !== null) {
      await deleteNote(selectedNoteIndex);
      setSelectedNoteIndex(null);
      setModalVisible(false);
      setShowConfirmDelete(false);
      await fetchNotes();
    }
  };
  
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">
      <Text className="text-2xl  mb-4 text-black dark:text-white"  style={{ fontFamily: `${font}-Regular` }}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(_, i) => i.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openModal(index)}
            style={{ flex: 1, marginBottom: 12 }}
          >
            <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl min-h-[100px] justify-center">
              <Text className="text-2xl text-black dark:text-white mb-1"  style={{ fontFamily: `${font}-SemiBold` }}>{item.title}</Text>
              <Text
                className=" text-md text-gray-700 dark:text-gray-300"
                numberOfLines={2}
                style={{ fontFamily: `${font}-Regular` }}
              >
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No notes found.
          </Text>
        }
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="w-full bg-white dark:bg-[#1F2937] p-6 rounded-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-black dark:text-white" style={{ fontFamily: `${font}-SemiBold` }}>Edit Note</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <Entypo name="cross" size={28} color={isLight ? 'black' : 'white'} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Title"
              className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-3 rounded-lg mb-3"
              style={{ fontFamily: `${font}-Medium` }}
            />
            <TextInput
              multiline
              value={editedContent}
              onChangeText={setEditedContent}
              className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-3 rounded-lg h-32"
              placeholder="Note..."
              style={{ fontFamily: `${font}-Medium` }}
            />

            {selectedNoteIndex !== null && (
              <View className="mt-4">
                <Text className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: `${font}-Regular` }}>
                  Created At: {formatDate(notes[selectedNoteIndex].createdAt)}
                </Text>
                {notes[selectedNoteIndex].updatedAt && (
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: `${font}-Regular` }}>
                    Updated At: {formatDate(notes[selectedNoteIndex].updatedAt!)}
                  </Text>
                )}
              </View>
            )}

            <View className="flex-row justify-between mt-5 gap-3">
              <TouchableOpacity
                onPress={handleUpdate}
                className="bg-green-600 flex-1 p-3 rounded-lg"
              >
                <Text className="text-white text-center" style={{ fontFamily: `${font}-SemiBold` }}
                >Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="bg-red-600 flex-1 p-3 rounded-lg"
              >
                <Text className="text-white text-center" style={{ fontFamily: `${font}-SemiBold` }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
  visible={showConfirmDelete}
  transparent
  animationType="fade"
  onRequestClose={() => setShowConfirmDelete(false)}
>
  <View className="flex-1 justify-center items-center bg-black/50 px-4">
    <View className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
      <Text className="text-lg font-semibold text-black dark:text-white mb-4" style={{ fontFamily: `${font}-SemiBold` }}>
        Are you sure you want to delete this note?
      </Text>

      <View className="flex-row justify-between mt-4 gap-2">
        <TouchableOpacity
          onPress={() => setShowConfirmDelete(false)}
          className="flex-1 bg-gray-400 p-3 rounded-lg"
        >
          <Text className="text-center text-white" style={{ fontFamily: `${font}-SemiBold` }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteConfirmed}
          className="flex-1 bg-red-600 p-3 rounded-lg"
        >
          <Text className="text-center text-white" style={{ fontFamily: `${font}-SemiBold` }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default NotesListScreen;
