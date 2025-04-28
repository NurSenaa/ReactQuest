import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { 
  BookOpen, 
  Target, 
  Award, 
  Play, 
  ChevronRight, 
  Flame,
  BarChart2,
  Code
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { REACT_CONCEPTS, PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { PROJECTS } from '@/constants/projects';
import { LEARNING_PLANS_STORAGE_KEY, UserLearningPlan } from '@/constants/learning-plans';
import { ACHIEVEMENTS_STORAGE_KEY } from '@/constants/achievements';
import GoalTracker from '@/components/GoalTracker';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userPlan, setUserPlan] = useState<UserLearningPlan | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<any[]>([]);
  const [todayDate, setTodayDate] = useState('');
  
  // Load user data
  useEffect(() => {
    loadUserData();
    
    // Format today's date
    const today = new Date();
    setTodayDate(today.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load completed lessons
      const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (storedProgress) {
        setCompletedLessons(JSON.parse(storedProgress));
      }
      
      // Load learning plan
      const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
      if (storedPlan) {
        setUserPlan(JSON.parse(storedPlan));
      }
      
      // Load achievements
      const storedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        setEarnedAchievements(JSON.parse(storedAchievements));
      }
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to a screen
  const navigateTo = (screen: string) => {
    router.push(screen);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Get recommended lessons
  const getRecommendedLessons = () => {
    // Filter out completed lessons
    const remainingLessons = REACT_CONCEPTS.filter(
      concept => !completedLessons.includes(concept.id)
    );
    
    // If user has a learning plan, use its level to recommend lessons
    if (userPlan) {
      const levelLessons = remainingLessons.filter(concept => {
        if (userPlan.level === 'beginner') {
          return concept.difficulty === 'beginner';
        } else if (userPlan.level === 'intermediate') {
          return concept.difficulty === 'intermediate' || concept.difficulty === 'beginner';
        } else {
          return true; // For advanced users, recommend any lesson
        }
      });
      
      return levelLessons.slice(0, 3);
    }
    
    // If no plan, recommend first 3 uncompleted lessons
    return remainingLessons.slice(0, 3);
  };
  
  // Get recommended projects
  const getRecommendedProjects = () => {
    // For simplicity, just return the first 2 projects
    return PROJECTS.slice(0, 2);
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return REACT_CONCEPTS.length > 0
      ? Math.round((completedLessons.length / REACT_CONCEPTS.length) * 100)
      : 0;
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba!</Text>
            <Text style={styles.date}>{todayDate}</Text>
          </View>
          
          {userPlan && (
            <View style={styles.streakContainer}>
              <Flame size={20} color="#FF9500" />
              <Text style={styles.streakText}>{userPlan.streakDays} gün seri</Text>
            </View>
          )}
        </View>
        
        <View style={styles.progressOverview}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Genel İlerleme</Text>
              <TouchableOpacity 
                style={styles.analyticsButton}
                onPress={() => navigateTo('/analytics')}
              >
                <BarChart2 size={16} color={COLORS.primary} />
                <Text style={styles.analyticsButtonText}>Analitik</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${calculateProgress()}%` }
                ]} 
              />
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedLessons.length}</Text>
                <Text style={styles.progressStatLabel}>Tamamlanan Ders</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{REACT_CONCEPTS.length - completedLessons.length}</Text>
                <Text style={styles.progressStatLabel}>Kalan Ders</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{earnedAchievements.length}</Text>
                <Text style={styles.progressStatLabel}>Başarı</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigateTo('/learn')}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <BookOpen size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>Öğren</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigateTo('/plan')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Target size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionTitle}>Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigateTo('/projects')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Code size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionTitle}>Projeler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigateTo('/achievements')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8EAF6' }]}>
              <Award size={24} color="#3F51B5" />
            </View>
            <Text style={styles.actionTitle}>Başarılar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Önerilen Dersler</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigateTo('/learn')}
            >
              <Text style={styles.seeAllButtonText}>Tümünü Gör</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedLessonsContainer}
          >
            {getRecommendedLessons().map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => {
                  if (lesson.videoId) {
                    router.push({
                      pathname: '/video/[id]',
                      params: { id: lesson.videoId }
                    });
                  } else {
                    navigateTo('/learn');
                  }
                }}
              >
                <View style={styles.lessonCardContent}>
                  <View style={[
                    styles.lessonCategory,
                    lesson.category === 'basics' ? { backgroundColor: '#E3F2FD', borderColor: '#2196F3' } :
                    lesson.category === 'state' ? { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' } :
                    lesson.category === 'ui' ? { backgroundColor: '#FFF3E0', borderColor: '#FF9800' } :
                    { backgroundColor: '#F3E5F5', borderColor: '#9C27B0' }
                  ]}>
                    <Text style={[
                      styles.lessonCategoryText,
                      lesson.category === 'basics' ? { color: '#2196F3' } :
                      lesson.category === 'state' ? { color: '#4CAF50' } :
                      lesson.category === 'ui' ? { color: '#FF9800' } :
                      { color: '#9C27B0' }
                    ]}>
                      {lesson.category === 'basics' ? 'Temel' :
                       lesson.category === 'state' ? 'State' :
                       lesson.category === 'ui' ? 'UI' :
                       'Navigasyon'}
                    </Text>
                  </View>
                  
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  
                  {lesson.videoId && (
                    <View style={styles.videoIndicator}>
                      <Play size={14} color={COLORS.white} />
                      <Text style={styles.videoIndicatorText}>Video</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.moreLessonsCard}
              onPress={() => navigateTo('/learn')}
            >
              <Text style={styles.moreLessonsText}>Daha Fazla Ders</Text>
              <ChevronRight size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Önerilen Projeler</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigateTo('/projects')}
            >
              <Text style={styles.seeAllButtonText}>Tümünü Gör</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedProjectsContainer}
          >
            {getRecommendedProjects().map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => {
                  router.push({
                    pathname: '/project/[id]',
                    params: { id: project.id }
                  });
                }}
              >
                <Image 
                  source={{ uri: project.image }} 
                  style={styles.projectImage}
                  resizeMode="cover"
                />
                
                <View style={styles.projectCardContent}>
                  <View style={styles.projectCardHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={[
                      styles.difficultyBadge,
                      project.difficulty === 'Kolay' ? { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' } :
                      project.difficulty === 'Orta' ? { backgroundColor: '#FFF3E0', borderColor: '#FF9800' } :
                      { backgroundColor: '#FFEBEE', borderColor: '#F44336' }
                    ]}>
                      <Text style={[
                        styles.difficultyText,
                        project.difficulty === 'Kolay' ? { color: '#4CAF50' } :
                        project.difficulty === 'Orta' ? { color: '#FF9800' } :
                        { color: '#F44336' }
                      ]}>
                        {project.difficulty}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.projectDescription} numberOfLines={2}>
                    {project.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.moreProjectsCard}
              onPress={() => navigateTo('/projects')}
            >
              <Text style={styles.moreProjectsText}>Daha Fazla Proje</Text>
              <ChevronRight size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        <GoalTracker onGoalComplete={() => loadUserData()} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
    marginLeft: 6,
  },
  progressOverview: {
    marginBottom: 24,
  },
  progressCard: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  analyticsButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  recommendedLessonsContainer: {
    paddingBottom: 8,
  },
  lessonCard: {
    width: 200,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
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
  lessonCardContent: {
    padding: 16,
  },
  lessonCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  lessonCategoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  videoIndicatorText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  moreLessonsCard: {
    width: 150,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  moreLessonsText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 8,
  },
  recommendedProjectsContainer: {
    paddingBottom: 8,
  },
  projectCard: {
    width: 250,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
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
  projectImage: {
    width: '100%',
    height: 120,
  },
  projectCardContent: {
    padding: 16,
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  moreProjectsCard: {
    width: 150,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  moreProjectsText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 8,
  },
});