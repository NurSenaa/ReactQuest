import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Bell,
  Award,
  BookOpen
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@/constants/colors';
import { LEARNING_PLANS_STORAGE_KEY, UserLearningPlan } from '@/constants/learning-plans';
import { PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import LevelAssessment from '@/components/LevelAssessment';
import WeeklyGoalSelector from '@/components/WeeklyGoalSelector';
import DaySelector from '@/components/DaySelector';
import ReminderSettings from '@/components/ReminderSettings';

export default function PlanScreen() {
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserLearningPlan | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showLevelAssessment, setShowLevelAssessment] = useState(false);
  const [showWeeklyGoalSelector, setShowWeeklyGoalSelector] = useState(false);
  const [showDaySelector, setShowDaySelector] = useState(false);
  
  // Load user plan and progress
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user plan
      const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
      if (storedPlan) {
        setUserPlan(JSON.parse(storedPlan));
      }
      
      // Load completed lessons
      const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (storedProgress) {
        setCompletedLessons(JSON.parse(storedProgress));
      }
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Save user plan
  const saveUserPlan = async (plan: UserLearningPlan) => {
    try {
      await AsyncStorage.setItem(LEARNING_PLANS_STORAGE_KEY, JSON.stringify(plan));
      setUserPlan(plan);
      
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to save user plan:', error);
    }
  };
  
  // Handle level assessment completion
  const handleLevelSelected = (level: 'beginner' | 'intermediate' | 'advanced') => {
    const newPlan: UserLearningPlan = userPlan 
      ? { ...userPlan, level } 
      : {
          level,
          weeklyGoal: 3,
          studyDays: [1, 3, 5], // Monday, Wednesday, Friday
          streakDays: 0,
          lastStudyDate: null,
        };
    
    saveUserPlan(newPlan);
    setShowLevelAssessment(false);
    
    // If this is the first time setting up a plan, show weekly goal selector next
    if (!userPlan) {
      setShowWeeklyGoalSelector(true);
    }
  };
  
  // Handle weekly goal selection
  const handleWeeklyGoalSelected = (weeklyGoal: number) => {
    if (!userPlan) return;
    
    const newPlan: UserLearningPlan = { ...userPlan, weeklyGoal };
    saveUserPlan(newPlan);
    setShowWeeklyGoalSelector(false);
    
    // If this is the first time setting up a plan, show day selector next
    if (!userPlan.studyDays || userPlan.studyDays.length === 0) {
      setShowDaySelector(true);
    }
  };
  
  // Handle study days selection
  const handleDaysSelected = (studyDays: number[]) => {
    if (!userPlan) return;
    
    const newPlan: UserLearningPlan = { ...userPlan, studyDays };
    saveUserPlan(newPlan);
    setShowDaySelector(false);
  };
  
  // Calculate weekly progress
  const calculateWeeklyProgress = () => {
    if (!userPlan) return { completed: 0, goal: 0, percentage: 0 };
    
    // Get current week's lessons
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Count lessons completed this week
    // This is a simplified example - in a real app, you'd track when each lesson was completed
    const weeklyCompleted = Math.min(completedLessons.length, userPlan.weeklyGoal);
    
    return {
      completed: weeklyCompleted,
      goal: userPlan.weeklyGoal,
      percentage: Math.round((weeklyCompleted / userPlan.weeklyGoal) * 100)
    };
  };
  
  // Get today's study status
  const getTodayStudyStatus = () => {
    if (!userPlan || !userPlan.studyDays || userPlan.studyDays.length === 0) {
      return { isStudyDay: false, completed: false };
    }
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Check if today is a study day
    const isStudyDay = userPlan.studyDays.includes(dayOfWeek);
    
    // Check if user has studied today
    // This is a simplified example - in a real app, you'd track daily completions
    const lastStudyDate = userPlan.lastStudyDate ? new Date(userPlan.lastStudyDate) : null;
    const completed = lastStudyDate 
      ? lastStudyDate.toDateString() === today.toDateString()
      : false;
    
    return { isStudyDay, completed };
  };
  
  // Get next study day
  const getNextStudyDay = () => {
    if (!userPlan || !userPlan.studyDays || userPlan.studyDays.length === 0) {
      return null;
    }
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Sort study days
    const sortedDays = [...userPlan.studyDays].sort((a, b) => a - b);
    
    // Find next study day
    let nextDay = sortedDays.find(day => day > dayOfWeek);
    
    // If no day found, get the first day of next week
    if (nextDay === undefined) {
      nextDay = sortedDays[0];
    }
    
    // Calculate date of next study day
    const nextDate = new Date(today);
    const daysToAdd = nextDay > dayOfWeek 
      ? nextDay - dayOfWeek 
      : 7 - dayOfWeek + nextDay;
    
    nextDate.setDate(today.getDate() + daysToAdd);
    
    return {
      dayName: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][nextDay],
      date: nextDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
    };
  };
  
  // Format level name
  const formatLevelName = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Başlangıç';
      case 'intermediate':
        return 'Orta';
      case 'advanced':
        return 'İleri';
      default:
        return level;
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Plan yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Target size={24} color={COLORS.primary} style={styles.titleIcon} />
          <Text style={styles.title}>Öğrenme Planı</Text>
        </View>
        <Text style={styles.subtitle}>
          Öğrenme hedeflerinizi belirleyin ve ilerlemenizi takip edin
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!userPlan ? (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Öğrenme Planı Oluşturun</Text>
            <Text style={styles.setupDescription}>
              Öğrenme sürecinizi daha etkili hale getirmek için kişisel bir öğrenme planı oluşturun.
              Bu plan, seviyenize uygun içerikler sunmanıza ve düzenli çalışma alışkanlığı geliştirmenize yardımcı olacak.
            </Text>
            
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => setShowLevelAssessment(true)}
            >
              <Text style={styles.setupButtonText}>Planı Oluştur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.planOverview}>
              <View style={styles.planCard}>
                <View style={styles.planCardHeader}>
                  <Text style={styles.planCardTitle}>Mevcut Plan</Text>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setShowLevelAssessment(true)}
                  >
                    <Text style={styles.editButtonText}>Düzenle</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.planDetails}>
                  <View style={styles.planDetail}>
                    <Text style={styles.planDetailLabel}>Seviye:</Text>
                    <Text style={styles.planDetailValue}>
                      {formatLevelName(userPlan.level)}
                    </Text>
                  </View>
                  
                  <View style={styles.planDetail}>
                    <Text style={styles.planDetailLabel}>Haftalık Hedef:</Text>
                    <View style={styles.planDetailValueContainer}>
                      <Text style={styles.planDetailValue}>
                        {userPlan.weeklyGoal} ders/hafta
                      </Text>
                      <TouchableOpacity 
                        style={styles.smallEditButton}
                        onPress={() => setShowWeeklyGoalSelector(true)}
                      >
                        <Text style={styles.smallEditButtonText}>Değiştir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.planDetail}>
                    <Text style={styles.planDetailLabel}>Çalışma Günleri:</Text>
                    <View style={styles.planDetailValueContainer}>
                      <Text style={styles.planDetailValue}>
                        {userPlan.studyDays && userPlan.studyDays.length > 0 
                          ? userPlan.studyDays.map(day => 
                              ['Pzr', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][day]
                            ).join(', ')
                          : 'Henüz seçilmedi'}
                      </Text>
                      <TouchableOpacity 
                        style={styles.smallEditButton}
                        onPress={() => setShowDaySelector(true)}
                      >
                        <Text style={styles.smallEditButtonText}>Değiştir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Haftalık İlerleme</Text>
              
              <View style={styles.weeklyProgressCard}>
                <View style={styles.progressHeader}>
                  <Calendar size={20} color={COLORS.primary} />
                  <Text style={styles.progressTitle}>Bu Hafta</Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${calculateWeeklyProgress().percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {calculateWeeklyProgress().completed}/{calculateWeeklyProgress().goal} ders tamamlandı
                  </Text>
                </View>
                
                <View style={styles.streakContainer}>
                  <View style={styles.streakInfo}>
                    <Award size={20} color="#FF9800" />
                    <Text style={styles.streakText}>
                      {userPlan.streakDays} günlük seri
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.streakTipButton}
                    onPress={() => {
                      Alert.alert(
                        "Seri Hakkında",
                        "Her gün en az bir ders tamamlayarak serinizi koruyun. Düzenli çalışma, öğrenme sürecinizi hızlandırır.",
                        [{ text: "Anladım" }]
                      );
                    }}
                  >
                    <Text style={styles.streakTipButtonText}>Bilgi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.todaySection}>
              <Text style={styles.sectionTitle}>Bugün</Text>
              
              <View style={styles.todayCard}>
                {getTodayStudyStatus().isStudyDay ? (
                  <>
                    <View style={styles.todayHeader}>
                      <Clock size={20} color={COLORS.primary} />
                      <Text style={styles.todayTitle}>Bugün Çalışma Günü</Text>
                    </View>
                    
                    <View style={styles.todayStatus}>
                      {getTodayStudyStatus().completed ? (
                        <View style={styles.completedStatus}>
                          <CheckCircle size={24} color="#4CAF50" />
                          <Text style={styles.completedStatusText}>
                            Bugünkü çalışmanızı tamamladınız!
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.pendingStatus}>
                          <BookOpen size={24} color={COLORS.primary} />
                          <Text style={styles.pendingStatusText}>
                            Bugün için henüz ders tamamlamadınız.
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.startLearningButton}
                      onPress={() => {
                        // Navigate to learning screen
                        router.push('/learn');
                        
                        // Provide haptic feedback
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }
                      }}
                    >
                      <Text style={styles.startLearningButtonText}>
                        {getTodayStudyStatus().completed 
                          ? 'Öğrenmeye Devam Et' 
                          : 'Öğrenmeye Başla'}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.todayHeader}>
                      <Calendar size={20} color={COLORS.textSecondary} />
                      <Text style={styles.todayTitleOff}>Bugün Dinlenme Günü</Text>
                    </View>
                    
                    {getNextStudyDay() && (
                      <View style={styles.nextStudyDay}>
                        <Text style={styles.nextStudyDayText}>
                          Bir sonraki çalışma gününüz:
                        </Text>
                        <Text style={styles.nextStudyDayDate}>
                          {getNextStudyDay()?.dayName}, {getNextStudyDay()?.date}
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.studyAnywayButton}
                      onPress={() => {
                        // Navigate to learning screen
                        router.push('/learn');
                        
                        // Provide haptic feedback
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }
                      }}
                    >
                      <Text style={styles.studyAnywayButtonText}>
                        Yine de Çalış
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            
            <ReminderSettings />
            
            <View style={styles.longTermGoalsSection}>
              <Text style={styles.sectionTitle}>Uzun Vadeli Hedefler</Text>
              
              <View style={styles.longTermGoalCard}>
                <Text style={styles.longTermGoalTitle}>1 Ayda Temel Bir Uygulama Geliştir</Text>
                <Text style={styles.longTermGoalDescription}>
                  Temel React Native kavramlarını öğrenerek basit bir uygulama geliştirin.
                </Text>
                <View style={styles.longTermGoalSteps}>
                  <Text style={styles.longTermGoalStepTitle}>Adımlar:</Text>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>1</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Temel React Native kavramlarını öğrenin (1 hafta)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>2</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Basit bir uygulama tasarlayın (3 gün)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>3</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Uygulamanın temel özelliklerini geliştirin (2 hafta)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>4</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Uygulamanızı test edin ve iyileştirin (1 hafta)
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.longTermGoalCard}>
                <Text style={styles.longTermGoalTitle}>3 Ayda Orta Seviye Geliştirici Ol</Text>
                <Text style={styles.longTermGoalDescription}>
                  React Native'in ileri konularını öğrenerek daha karmaşık uygulamalar geliştirin.
                </Text>
                <View style={styles.longTermGoalSteps}>
                  <Text style={styles.longTermGoalStepTitle}>Adımlar:</Text>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>1</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Temel kavramları pekiştirin (2 hafta)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>2</Text>
                    <Text style={styles.longTermGoalStepText}>
                      State yönetimi ve API entegrasyonunu öğrenin (3 hafta)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>3</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Navigasyon ve form yönetimini öğrenin (2 hafta)
                    </Text>
                  </View>
                  <View style={styles.longTermGoalStep}>
                    <Text style={styles.longTermGoalStepNumber}>4</Text>
                    <Text style={styles.longTermGoalStepText}>
                      Orta seviye bir proje geliştirin (5 hafta)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      
      {showLevelAssessment && (
        <LevelAssessment
          currentLevel={userPlan?.level}
          onLevelSelected={handleLevelSelected}
          onClose={() => setShowLevelAssessment(false)}
        />
      )}
      
      {showWeeklyGoalSelector && userPlan && (
        <WeeklyGoalSelector
          currentGoal={userPlan.weeklyGoal}
          onGoalSelected={handleWeeklyGoalSelected}
          onClose={() => setShowWeeklyGoalSelector(false)}
        />
      )}
      
      {showDaySelector && userPlan && (
        <DaySelector
          selectedDays={userPlan.studyDays || []}
          onDaysSelected={handleDaysSelected}
          onClose={() => setShowDaySelector(false)}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  
  // Setup container styles
  setupContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
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
  setupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  setupDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  setupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
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
  setupButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Plan overview styles
  planOverview: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
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
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  editButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  planDetails: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
  },
  planDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  planDetailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  planDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  planDetailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallEditButton: {
    marginLeft: 8,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  smallEditButtonText: {
    fontSize: 10,
    color: COLORS.primary,
  },
  
  // Progress section styles
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  weeklyProgressCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  streakTipButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakTipButtonText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
  },
  
  // Today section styles
  todaySection: {
    marginBottom: 24,
  },
  todayCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
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
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  todayTitleOff: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  todayStatus: {
    marginBottom: 16,
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
  },
  completedStatusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 8,
  },
  pendingStatusText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  startLearningButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(74, 111, 255, 0.2)',
      },
    }),
  },
  startLearningButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  nextStudyDay: {
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextStudyDayText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  nextStudyDayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  studyAnywayButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  studyAnywayButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Long term goals section styles
  longTermGoalsSection: {
    marginBottom: 24,
  },
  longTermGoalCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  longTermGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  longTermGoalDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  longTermGoalSteps: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
  },
  longTermGoalStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  longTermGoalStep: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  longTermGoalStepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  longTermGoalStepText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
});