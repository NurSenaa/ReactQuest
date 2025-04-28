import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { Trash2, Edit2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Note {
  id: string;
  text: string;
  date: string;
  videoId?: string;
  videoTitle?: string;
}

const STORAGE_KEY = 'user_notes';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Load notes from AsyncStorage on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to save notes:', error);
      Alert.alert('Hata', 'Notlar kaydedilirken bir hata oluştu.');
    }
  };

  const addOrUpdateNote = async () => {
    if (noteText.trim() === '') return;
    
    if (editingNote) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, text: noteText, date: new Date().toLocaleDateString('tr-TR') }
          : note
      );
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setEditingNote(null);
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText,
        date: new Date().toLocaleDateString('tr-TR'),
      };
      
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
    }
    
    setNoteText('');
    
    // Provide haptic feedback on note addition
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const startEditingNote = (note: Note) => {
    setEditingNote(note);
    setNoteText(note.text);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const deleteNote = async (id: string) => {
    // Confirm deletion
    Alert.alert(
      "Notu Sil",
      "Bu notu silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        { 
          text: "Sil", 
          onPress: async () => {
            // Provide haptic feedback on note deletion
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            
            const updatedNotes = notes.filter(note => note.id !== id);
            setNotes(updatedNotes);
            await saveNotes(updatedNotes);
            
            // If deleting the note being edited, cancel editing
            if (editingNote && editingNote.id === id) {
              cancelEditing();
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteContent}>
        <Text style={styles.noteText}>{item.text}</Text>
        <View style={styles.noteMetaContainer}>
          <Text style={styles.noteDate}>{item.date}</Text>
          {item.videoTitle && (
            <View style={styles.videoTagContainer}>
              <Text style={styles.videoTagText}>{item.videoTitle}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.noteActions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => startEditingNote(item)}
        >
          <Edit2 size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteNote(item.id)}
        >
          <Trash2 size={18} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={editingNote ? "Notu düzenle..." : "Not ekle..."}
          value={noteText}
          onChangeText={setNoteText}
          multiline
        />
        <View style={styles.buttonContainer}>
          {editingNote && (
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={cancelEditing}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[
              styles.addButton,
              noteText.trim() === '' && styles.addButtonDisabled
            ]} 
            onPress={addOrUpdateNote}
            disabled={noteText.trim() === ''}
          >
            <Text style={styles.addButtonText}>
              {editingNote ? "Güncelle" : "Kaydet"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Notlar yükleniyor...</Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz not eklenmedi</Text>
          <Text style={styles.emptySubtext}>Eğitim videoları hakkında notlar almak için yukarıdaki alanı kullanabilirsiniz.</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
  notesList: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  noteMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  noteDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  videoTagContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoTagText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '500',
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});