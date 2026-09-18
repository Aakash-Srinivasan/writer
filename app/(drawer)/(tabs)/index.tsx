import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useTheme } from '../../../context/ThemeContext';
import {
  deleteNote,
  loadNotes,
  togglePinNote,
  updateNote,
  getSortPreference,
  setSortPreference,
  Note,
  SortOption,
} from '../../../utils/storage';

import { useFont } from '~/app/_layout';

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'alphabetical', label: 'A-Z' },
];



const NotesListScreen = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { font } = useFont();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const swipeRefs = useRef<Record<string, Swipeable | null>>({});
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [speakingModalVisible, setSpeakingModalVisible] = useState(false);
  const [speakingText, setSpeakingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = (text: string) => {
    if (text.trim()) {
      setSpeakingText(text);
      setSpeakingModalVisible(true);
      setIsLoading(true);   // Start loading

      try {
        Speech.speak(text, {
          onStart: () => {
            setIsLoading(false); // Hide loading
          },
          onDone: () => {
            setSpeakingModalVisible(false);
          },
          onStopped: () => {
            setSpeakingModalVisible(false);
          },
          onError: () => {
            setSpeakingModalVisible(false);
          }
        });
      } catch (error) {
        console.warn('Text-to-speech failed to start.', error);
        setIsLoading(false);
        setSpeakingModalVisible(false);
        Alert.alert('Playback Unavailable', 'Sorry, voice playback could not be started on this device.');
      }
    }
  };

  const handleStop = () => {
    try {
      Speech.stop();
    } catch (error) {
      console.warn('Failed to stop text-to-speech playback.', error);
    } finally {
      setSpeakingModalVisible(false);
    }
  };

  const handleShare = async (note: Note) => {
    try {
      await Share.share({
        title: note.title,
        message: note.content ? `${note.title}\n\n${note.content}` : note.title,
      });
    } catch (error) {
      console.warn('Failed to share note.', error);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePinNote(id);
      await fetchNotes();
    } catch (error) {
      console.warn('Failed to toggle pin.', error);
      Alert.alert('Update Failed', 'Something went wrong. Please try again.');
    }
  };


  const fetchNotes = async () => {
    try {
      const data = await loadNotes();
      setNotes(data);
    } catch (error) {
      console.warn('Failed to fetch notes.', error);
      Alert.alert('Load Failed', 'Could not load your notes. Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      getSortPreference().then(setSortOption);
    }, [])
  );

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setSortPreference(option);
  };

  const handleSwipeDelete = (note: Note) => {
    swipeRefs.current[note.id]?.close();
    setSelectedNoteId(note.id);
    setShowConfirmDelete(true);
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null;

  // Pinned notes always float to the top; within each group (pinned /
  // unpinned) the chosen sort applies on top of that.
  const visibleNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
      )
      : notes;

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOption === 'oldest' ? aTime - bTime : bTime - aTime;
    });

    return sorted.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notes, searchQuery, sortOption]);

  const openModal = (note: Note) => {
    setSelectedNoteId(note.id);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedNoteId !== null) {
      if (!editedTitle.trim() && !editedContent.trim()) return; // allow title-only

      try {
        await updateNote(selectedNoteId, {
          title: editedTitle,
          content: editedContent,
        });

        await fetchNotes();
        setModalVisible(false);
      } catch (error) {
        console.warn('Failed to update note.', error);
        Alert.alert('Update Failed', 'Something went wrong while saving your changes. Please try again.');
      }
    }
  };

  const confirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedNoteId !== null) {
      try {
        await deleteNote(selectedNoteId);
        setSelectedNoteId(null);
        setModalVisible(false);
        setShowConfirmDelete(false);
        await fetchNotes();
      } catch (error) {
        console.warn('Failed to delete note.', error);
        setShowConfirmDelete(false);
        Alert.alert('Delete Failed', 'Something went wrong while deleting this note. Please try again.');
      }
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <View className="flex-1 bg-white dark:bg-black p-4">

      <FlatList
        data={visibleNotes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Swipeable
            ref={(ref) => { swipeRefs.current[item.id] = ref; }}
            renderRightActions={() => (
              <TouchableOpacity
                onPress={() => handleSwipeDelete(item)}
                className="bg-red-600 rounded-2xl ml-2 items-center justify-center"
                style={{ width: 64 }}
              >
                <Entypo name="trash" size={22} color="#fff" />
              </TouchableOpacity>
            )}
            overshootRight={false}
            containerStyle={{ flex: 1, marginBottom: 16 }}
          >
          <TouchableOpacity
            onPress={() => openModal(item)}
          >
            <View className="relative bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700" style={{ minHeight: 170 }} >

              {/* Pin toggle - Top Left */}
              <TouchableOpacity
                onPress={() => handleTogglePin(item.id)}
                className="absolute top-3 left-3 bg-gray-200 dark:bg-gray-700 p-1.5 rounded-full z-10"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Entypo
                  name={item.pinned ? 'star' : 'star-outlined'}
                  size={16}
                  color={item.pinned ? '#F59E0B' : (isLight ? 'black' : 'white')}
                />
              </TouchableOpacity>

              {/* Tap to Hear Icon - Top Right */}
              <TouchableOpacity
                onPress={() => handleSpeak(`${item.title}. ${item.content}`)}
                className="absolute top-3 right-3 flex-row items-center bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-full z-10"
              >
                <Text
                  className="text-xs text-black dark:text-white mr-1"
                  style={{ fontFamily: `${font}-Medium` }}
                >
                  Tap to hear
                </Text>
                <Entypo name="sound" size={18} color={isLight ? 'black' : 'white'} />
              </TouchableOpacity>

              {/* Title */}
              <Text
                className="text-xl text-black dark:text-white mb-2 pr-14 mt-6" // right padding to avoid overlapping
                style={{ fontFamily: `${font}-SemiBold` }}
              >
                {item.title}
              </Text>

              {/* Description */}
              <Text
                className="text-base text-gray-700 dark:text-gray-300"
                numberOfLines={2}
                style={{ fontFamily: `${font}-Regular` }}
              >
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
          </Swipeable>


        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10 px-4 align-items-center">
            <Image
              source={require('../../../assets/noData.png')}
              className="w-64 h-64 mb-4"
              resizeMode="cover"
            />
            <Text
              className="text-base text-gray-500 dark:text-gray-400 text-center"
              style={{ fontFamily: `${font}-Medium` }}
            >
              {searchQuery.trim()
                ? 'No drafts match your search.'
                : 'No drafts yet - tap Add to write your first one.'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-2xl mb-3 text-black dark:text-white" style={{ fontFamily: `${font}-SemiBold` }}>My Drafts</Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3">
              <Entypo name="magnifying-glass" size={18} color={isLight ? '#6B7280' : '#9CA3AF'} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search drafts..."
                placeholderTextColor={isLight ? '#6B7280' : '#9CA3AF'}
                className="flex-1 text-black dark:text-white p-3 ml-2"
                style={{ fontFamily: `${font}-Medium` }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Entypo name="circle-with-cross" size={18} color={isLight ? '#6B7280' : '#9CA3AF'} />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row gap-2 mt-3">
              {SORT_OPTIONS.map((opt) => {
                const isActive = sortOption === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => handleSortChange(opt.key)}
                    className={`px-3 py-1.5 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    <Text
                      className={`text-xs ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      style={{ fontFamily: `${font}-Medium` }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        } />

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
              <Text className="text-xl  text-black dark:text-white" style={{ fontFamily: `${font}-SemiBold` }}>Edit Draft</Text>
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
              style={{ fontFamily: `${font}-Medium`, textAlignVertical: 'top', }}
            />
            <Text
              className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1"
              style={{ fontFamily: `${font}-Regular` }}
            >
              {countWords(editedContent)} words - {editedContent.length} characters
            </Text>

            {selectedNote && (
              <View className="mt-4">
                <Text className="text-xs text-gray-600 dark:text-gray-400" style={{ fontFamily: `${font}-Regular` }}>
                  Created At: {formatDate(selectedNote.createdAt)}
                </Text>
                {selectedNote.updatedAt && (
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: `${font}-Regular` }}>
                    Updated At: {formatDate(selectedNote.updatedAt)}
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
                onPress={() => selectedNote && handleShare(selectedNote)}
                className="bg-blue-600 flex-1 p-3 rounded-lg flex-row justify-center items-center gap-2"
              >
                <Entypo name="share" size={16} color="white" />
                <Text className="text-white text-center" style={{ fontFamily: `${font}-SemiBold` }}
                >Share</Text>
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
      <Modal
        visible={speakingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleStop}
      >
        <View className="flex-1 justify-center items-center bg-black/70 px-4">
          <View className="w-full bg-white dark:bg-[#1F2937] p-6 rounded-xl items-center">
            <Text className="text-xl text-black dark:text-white mb-4" style={{ fontFamily: `${font}-SemiBold` }}>
              Speaking...
            </Text>

            {isLoading ? (
              <Text className="text-base text-gray-500 mb-4" style={{ fontFamily: `${font}-Medium` }}>
                Please wait a moment!!!
              </Text>
            ) : (
              <>
                {/* Replace this with your animated waveform component */}
                <View className="w-20 h-20 bg-purple-500 rounded-full mb-4 animate-pulse" />

                <Text className="text-center text-black dark:text-white mb-4" style={{ fontFamily: `${font}-Regular` }}>
                  {speakingText}
                </Text>
              </>
            )}

            {!isLoading && (
              <View className="flex-row gap-3">

                <TouchableOpacity onPress={handleStop} className="bg-red-600 px-4 py-2 rounded-lg">
                  <Text className="text-white" style={{ fontFamily: `${font}-SemiBold` }}>Stop</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>
      </Modal>

    </View>
  );
};

export default NotesListScreen;
