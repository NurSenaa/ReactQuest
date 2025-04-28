import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { 
  ACHIEVEMENTS, 
  Achievement, 
  UserAchievement, 
  ACHIEVEMENTS_STORAGE_KEY,
  checkForNewAchievements
} from '@/constants/achievements';
import { LEARNING_PLANS_STORAGE_KEY } from '@/constants/learning-plans';
import { PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { QUIZ_STORAGE_KEY } from '@/constants/quizzes';
import { REACT_CONCEPTS } from '@/constants/react-concepts';
import { Award, Bell, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Components
import AchievementCard from '@/components/AchievementCard';
import NotificationSettings from '@/components/NotificationSettings';

export default function AchievementsScreen() {
  const [loading, setLoading] = useState(true);
  const [earnedAchievements, setEarnedAchievements] = useState<UserAchievement[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showAchievementDetail, setShowAchievementDetail] = useState(false);
  
  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load earned achievements
      const storedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        setEarnedAchievements(JSON.parse(storedAchievements));
      }
      
      // Load streak days from learning plan
      const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
      if (storedPlan) {
        const plan = JSON.parse(storedPlan);
        setStreakDays(plan.streakDays || 0);
      }
      
      // Load completed lessons
      const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (storedProgress) {
        setCompletedLessons(JSON.parse(storedProgress));
      }
      
      // Load quiz results
      const storedQuizResults = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      if (storedQuizResults) {
        setQuizResults(JSON.parse(storedQuizResults));
      }
      
      // Check for new achievements
      await checkAndUpdateAchievements();
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const checkAndUpdateAchievements = async () => {
    try {
      // Load current achievements
      const storedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      let currentAchievements: UserAchievement[] = storedAchievements 
        ? JSON.parse(storedAchievements) 
        : [];
      
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
      
      // If new achievements were earned, update storage and state
      if (newAchievements.length > 0) {
        const updatedAchievements = [...currentAchievements, ...newAchievements];
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));
        setEarnedAchievements(updatedAchievements);
        
        // Provide haptic feedback for new achievements
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };
  
  const openAchievementDetail = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementDetail(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const getAchievementProgress = (achievement: Achievement) => {
    switch (achievement.type) {
      case 'streak':
        return {
          current: streakDays,
          required: achievement.requiredValue,
          percentage: Math.min(100, Math.round((streakDays / achievement.requiredValue) * 100))
        };
      case 'lessons':
        if (achievement.id === 'lessons_all') {
          return {
            current: completedLessons.length,
            required: REACT_CONCEPTS.length,
            percentage: Math.min(100, Math.round((completedLessons.length / REACT_CONCEPTS.length) * 100))
          };
        } else {
          return {
            current: completedLessons.length,
            required: achievement.requiredValue,
            percentage: Math.min(100, Math.round((completedLessons.length / achievement.requiredValue) * 100))
          };
        }
      case 'quizzes':
        if (achievement.id === 'quiz_perfect') {
          const hasPerfectScore = quizResults.some(result => 
            result.score === result.totalQuestions && result.totalQuestions > 0
          );
          return {
            current: hasPerfectScore ? 1 : 0,
            required: 1,
            percentage: hasPerfectScore ? 100 : 0
          };
        } else {
          return {
            current: quizResults.length,
            required: achievement.requiredValue,
            percentage: Math.min(100, Math.round((quizResults.length / achievement.requiredValue) * 100))
          };
        }
      default:
        return { current: 0, required: 0, percentage: 0 };
    }
  };
  
  const isAchievementEarned = (achievementId: string) => {
    return earnedAchievements.some(a => a.id === achievementId);
  };
  
  const getEarnedDate = (achievementId: string) => {
    const achievement = earnedAchievements.find(a => a.id === achievementId);
    return achievement ? achievement.dateEarned : undefined;
  };
  
  // Group achievements by type
  const streakAchievements = ACHIEVEMENTS.filter(a => a.type === 'streak');
  const lessonAchievements = ACHIEVEMENTS.filter(a => a.type === 'lessons');
  const quizAchievements = ACHIEVEMENTS.filter(a => a.type === 'quizzes');
  
  // Calculate total progress
  const totalAchievements = ACHIEVEMENTS.length;
  const earnedCount = earnedAchievements.length;
  const progressPercentage = totalAchievements > 0 
    ? Math.round((earnedCount / totalAchievements) * 100) 
    : 0;
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Başarılar yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Award size={24} color={COLORS.primary} style={styles.titleIcon} />
          <Text style={styles.title}>Başarılarım</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => setShowNotificationSettings(true)}
        >
          <Bell size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Genel İlerleme</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressSubtext}>
            {earnedCount} / {totalAchievements} başarı kazanıldı
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Seri Başarıları</Text>
          
          {streakAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              earned={isAchievementEarned(achievement.id)}
              earnedDate={getEarnedDate(achievement.id)}
              onPress={() => openAchievementDetail(achievement)}
            />
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ders Başarıları</Text>
          
          {lessonAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              earned={isAchievementEarned(achievement.id)}
              earnedDate={getEarnedDate(achievement.id)}
              onPress={() => openAchievementDetail(achievement)}
            />
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quiz Başarıları</Text>
          
          {quizAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              earned={isAchievementEarned(achievement.id)}
              earnedDate={getEarnedDate(achievement.id)}
              onPress={() => openAchievementDetail(achievement)}
            />
          ))}
        </View>
      </ScrollView>
      
      {/* Achievement Detail Modal */}
      <Modal
        visible={showAchievementDetail}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAchievementDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Başarı Detayı</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAchievementDetail(false)}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {selectedAchievement && (
              <View style={styles.achievementDetailContainer}>
                <View style={[
                  styles.achievementIconContainer,
                  { backgroundColor: `${selectedAchievement.color}20` }
                ]}>
                  <Award size={48} color={selectedAchievement.color} />
                </View>
                
                <Text style={[
                  styles.achievementTitle,
                  { color: selectedAchievement.color }
                ]}>
                  {selectedAchievement.title}
                </Text>
                
                <Text style={styles.achievementDescription}>
                  {selectedAchievement.description}
                </Text>
                
                {isAchievementEarned(selectedAchievement.id) ? (
                  <View style={styles.earnedContainer}>
                    <Text style={styles.earnedText}>
                      Tebrikler! Bu başarıyı kazandınız.
                    </Text>
                    <Text style={styles.earnedDate}>
                      Kazanıldı: {new Date(getEarnedDate(selectedAchievement.id) || '').toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.progressDetailContainer}>
                    <View style={styles.progressDetailHeader}>
                      <Text style={styles.progressDetailTitle}>İlerleme</Text>
                      <Text style={styles.progressDetailPercentage}>
                        {getAchievementProgress(selectedAchievement).percentage}%
                      </Text>
                    </View>
                    
                    <View style={styles.progressDetailBar}>
                      <View 
                        style={[
                          styles.progressDetailFill, 
                          { 
                            width: `${getAchievementProgress(selectedAchievement).percentage}%`,
                            backgroundColor: selectedAchievement.color
                          }
                        ]} 
                      />
                    </View>
                    
                    <Text style={styles.progressDetailText}>
                      {getAchievementProgress(selectedAchievement).current} / {getAchievementProgress(selectedAchievement).required} tamamlandı
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowAchievementDetail(false)}
            >
              <Text style={styles.closeModalButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  achievementDetailContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  achievementIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  earnedContainer: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  earnedText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 4,
  },
  earnedDate: {
    fontSize: 14,
    color: '#388E3C',
  },
  progressDetailContainer: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 8,
  },
  progressDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDetailTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  progressDetailPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressDetailBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressDetailFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(74, 111, 255, 0.2)',
      },
    }),
  },
  closeModalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});