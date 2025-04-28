import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookOpen, ArrowLeft, Share2, CheckCircle, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';

import { COLORS } from '@/constants/colors';
import { VIDEOS } from '@/constants/videos';
import { REACT_CONCEPTS, PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import VideoPlayer from '@/components/VideoPlayer';
import { 
  ACHIEVEMENTS_STORAGE_KEY, 
  checkForNewAchievements 
} from '@/constants/achievements';
import { QUIZ_STORAGE_KEY } from '@/constants/quizzes';
import { LEARNING_PLANS_STORAGE_KEY, updateStreak } from '@/constants/learning-plans';

interface Note {
  id: string;
  text: string;
  date: string;
  videoId?: string;
  videoTitle?: string;
}

const STORAGE_KEY = 'user_notes';
const WATCHED_VIDEOS_KEY = 'watched_videos';

export default function VideoDetailScreen() {
  const { id, source } = useLocalSearchParams<{ id: string, source?: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Find video from either VIDEOS or REACT_CONCEPTS based on source
  const video = source === 'learn' 
    ? REACT_CONCEPTS.find(v => v.videoId === id)
    : VIDEOS.find(v => v.id === id);
  
  const videoId = source === 'learn' ? id : video?.videoId;
  
  // Load watched videos from AsyncStorage
  useEffect(() => {
    const loadWatchedVideos = async () => {
      try {
        const storedWatchedVideos = await AsyncStorage.getItem(WATCHED_VIDEOS_KEY);
        if (storedWatchedVideos) {
          const parsedWatchedVideos = JSON.parse(storedWatchedVideos);
          setWatchedVideos(parsedWatchedVideos);
          
          if (id && parsedWatchedVideos.includes(id)) {
            setIsWatched(true);
          }
        }
      } catch (error) {
        console.error('Failed to load watched videos:', error);
      }
    };
    
    const loadCompletedLessons = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (storedProgress) {
          setCompletedLessons(JSON.parse(storedProgress));
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    };
    
    loadWatchedVideos();
    if (source === 'learn') {
      loadCompletedLessons();
    }
  }, [id, source]);

  // Save watched videos to AsyncStorage
  const saveWatchedVideos = async (updatedWatchedVideos: string[]) => {
    try {
      await AsyncStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(updatedWatchedVideos));
    } catch (error) {
      console.error('Failed to save watched videos:', error);
    }
  };

  // Save completed lessons to AsyncStorage
  const saveCompletedLessons = async (updatedCompletedLessons: string[]) => {
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedCompletedLessons));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const toggleWatchedStatus = async () => {
    if (!id) return;
    
    let updatedWatchedVideos: string[];
    
    if (isWatched) {
      // Remove from watched videos
      updatedWatchedVideos = watchedVideos.filter(videoId => videoId !== id);
    } else {
      // Add to watched videos
      updatedWatchedVideos = [...watchedVideos, id];
      
      // If from learn section, also mark the lesson as completed
      if (source === 'learn') {
        const concept = REACT_CONCEPTS.find(c => c.videoId === id);
        if (concept && !completedLessons.includes(concept.id)) {
          const updatedCompletedLessons = [...completedLessons, concept.id];
          setCompletedLessons(updatedCompletedLessons);
          saveCompletedLessons(updatedCompletedLessons);
          
          // Update streak
          const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
          if (storedPlan) {
            const plan = JSON.parse(storedPlan);
            const updatedPlan = updateStreak(plan);
            await AsyncStorage.setItem(LEARNING_PLANS_STORAGE_KEY, JSON.stringify(updatedPlan));
          }
          
          // Check for new achievements
          await checkForAchievements();
        }
      }
      
      // Provide haptic feedback when marking as watched
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    
    setIsWatched(!isWatched);
    setWatchedVideos(updatedWatchedVideos);
    saveWatchedVideos(updatedWatchedVideos);
  };
  
  // Check for new achievements
  const checkForAchievements = async () => {
    try {
      // Load current achievements
      const storedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      let currentAchievements = storedAchievements ? JSON.parse(storedAchievements) : [];
      
      // Load other data needed for achievement checks
      const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
      const streakDays = storedPlan ? JSON.parse(storedPlan).streakDays || 0 : 0;
      
      const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      const completedLessons = storedProgress ? JSON.parse(storedProgress) : [];
      
      const storedQuizResults = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      const quizResults = storedQuizResults ? JSON.parse(storedQuizResults) : [];
      
      // Check for new achievements
      const newAchievements = checkForNewAchievements(
        streakDays,
        completedLessons,
        quizResults,
        REACT_CONCEPTS.length,
        currentAchievements
      );
      
      // If new achievements were earned, update storage
      if (newAchievements.length > 0) {
        const updatedAchievements = [...currentAchievements, ...newAchievements];
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
        
        // Show achievement notification
        if (newAchievements.length === 1) {
          Alert.alert(
            "Yeni Başarı Kazandınız!",
            `"${newAchievements[0].id}" başarısını kazandınız. Başarılar sayfasından detayları görebilirsiniz.`,
            [{ text: "Tamam" }]
          );
        } else {
          Alert.alert(
            "Yeni Başarılar Kazandınız!",
            `${newAchievements.length} yeni başarı kazandınız. Başarılar sayfasından detayları görebilirsiniz.`,
            [{ text: "Tamam" }]
          );
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };
  
  if (!video || !videoId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Video bulunamadı</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const saveNote = async () => {
    if (noteText.trim() === '') return;
    
    try {
      // Get existing notes
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      let notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText,
        date: new Date().toLocaleDateString('tr-TR'),
        videoId: source === 'learn' ? videoId : id,
        videoTitle: video.title,
      };
      
      // Add new note to the beginning of the array
      notes = [newNote, ...notes];
      
      // Save updated notes
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      
      // Clear input
      setNoteText('');
      
      // Show success message
      Alert.alert('Başarılı', 'Notunuz kaydedildi.');
      
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      Alert.alert('Hata', 'Not kaydedilirken bir hata oluştu.');
    }
  };

  const shareVideo = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Bilgi', 'Paylaşım özelliği web platformunda desteklenmemektedir.');
      return;
    }
    
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const message = `${video.title} - React Native Eğitim Videosu: ${url}`;
        
        await Sharing.shareAsync(url, {
          dialogTitle: 'Videoyu Paylaş',
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      } else {
        Alert.alert('Bilgi', 'Paylaşım özelliği bu cihazda desteklenmemektedir.');
      }
    } catch (error) {
      console.error('Failed to share video:', error);
      Alert.alert('Hata', 'Video paylaşılırken bir hata oluştu.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: video.title,
          headerBackTitle: source === 'learn' ? 'Dersler' : 'Videolar',
          headerRight: () => (
            Platform.OS !== 'web' ? (
              <TouchableOpacity onPress={shareVideo} style={styles.headerButton}>
                <Share2 size={22} color={COLORS.primary} />
              </TouchableOpacity>
            ) : null
          ),
        }} 
      />
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.videoContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Video yükleniyor...</Text>
              </View>
            )}
            
            <VideoPlayer 
              videoId={videoId} 
              onLoad={() => setLoading(false)}
            />
          </View>
          
          <View style={styles.videoInfoContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <TouchableOpacity 
                style={styles.watchedButton}
                onPress={toggleWatchedStatus}
              >
                {isWatched ? (
                  <CheckCircle size={24} color={COLORS.primary} />
                ) : (
                  <Circle size={24} color={COLORS.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.videoAuthor}>
              {source === 'learn' ? 'React Native Eğitim' : video.author}
            </Text>
            <Text style={styles.videoDescription}>{video.content || video.description}</Text>
            
            <View style={styles.metaContainer}>
              {source === 'learn' ? (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {REACT_CONCEPTS.find(c => c.videoId === id)?.category === 'basics' ? 'Temel Kavramlar' :
                     REACT_CONCEPTS.find(c => c.videoId === id)?.category === 'state' ? 'State Yönetimi' :
                     REACT_CONCEPTS.find(c => c.videoId === id)?.category === 'ui' ? 'UI ve Stil' :
                     REACT_CONCEPTS.find(c => c.videoId === id)?.category === 'navigation' ? 'Navigasyon' : 'Genel'}
                  </Text>
                </View>
              ) : (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{video.category}</Text>
                </View>
              )}
              {source !== 'learn' && (
                <Text style={styles.durationText}>Süre: {video.duration}</Text>
              )}
            </View>
            
            <View style={styles.watchedStatusContainer}>
              <Text style={styles.watchedStatusText}>
                {isWatched ? "Bu videoyu izlediniz" : "Bu videoyu henüz izlemediniz"}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.watchedStatusButton,
                  isWatched ? styles.unwatchButton : styles.watchButton
                ]}
                onPress={toggleWatchedStatus}
              >
                <Text style={[
                  styles.watchedStatusButtonText,
                  isWatched ? styles.unwatchButtonText : null
                ]}>
                  {isWatched ? "İzlemedim" : "İzledim"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.noteContainer}>
            <View style={styles.noteTitleContainer}>
              <BookOpen size={20} color={COLORS.primary} />
              <Text style={styles.noteTitle}>Video Notu Ekle</Text>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Bu video hakkında notlarınızı buraya yazabilirsiniz..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[
                styles.saveButton,
                noteText.trim() === '' && styles.saveButtonDisabled
              ]} 
              onPress={saveNote}
              disabled={noteText.trim() === ''}
            >
              <Text style={styles.saveButtonText}>Notu Kaydet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  videoContainer: {
    height: Platform.OS === 'web' ? 400 : 220,
    backgroundColor: COLORS.black,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 14,
  },
  videoInfoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  watchedButton: {
    padding: 4,
  },
  videoAuthor: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 12,
  },
  videoDescription: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  durationText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  watchedStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  watchedStatusText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  watchedStatusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  watchButton: {
    backgroundColor: COLORS.primary,
  },
  unwatchButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  watchedStatusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  unwatchButtonText: {
    color: COLORS.textSecondary,
  },
  noteContainer: {
    padding: 16,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  noteInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(74, 111, 255, 0.2)',
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
});