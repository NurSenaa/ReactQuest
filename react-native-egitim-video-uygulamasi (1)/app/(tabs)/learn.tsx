import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { REACT_CONCEPTS, CATEGORIES, PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { QUIZ_QUESTIONS, QUIZ_STORAGE_KEY, QuizResult } from '@/constants/quizzes';
import AccordionItem from '@/components/AccordionItem';
import QuizModal from '@/components/QuizModal';
import { BookOpen, Layers, ToggleLeft, Palette, Navigation, CheckCircle, Circle, BookCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');

  // Load completed lessons and quiz results from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load progress
        const storedProgress = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (storedProgress) {
          setCompletedLessons(JSON.parse(storedProgress));
        }
        
        // Load quiz results
        const storedQuizResults = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
        if (storedQuizResults) {
          setQuizResults(JSON.parse(storedQuizResults));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save completed lessons to AsyncStorage
  const saveProgress = async (updatedProgress: string[]) => {
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Toggle lesson completion status
  const toggleLessonCompletion = (lessonId: string) => {
    let updatedCompletedLessons: string[];
    
    if (completedLessons.includes(lessonId)) {
      // Remove from completed lessons
      updatedCompletedLessons = completedLessons.filter(id => id !== lessonId);
    } else {
      // Add to completed lessons
      updatedCompletedLessons = [...completedLessons, lessonId];
      
      // Provide haptic feedback when marking as completed
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    
    setCompletedLessons(updatedCompletedLessons);
    saveProgress(updatedCompletedLessons);
  };

  // Open quiz modal for a lesson
  const openQuizForLesson = (lessonId: string) => {
    const lesson = REACT_CONCEPTS.find(concept => concept.id === lessonId);
    if (lesson) {
      setSelectedLessonId(lessonId);
      setSelectedLessonTitle(lesson.title);
      setQuizModalVisible(true);
      
      // Provide haptic feedback when opening quiz
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  // Filter concepts by category
  const filteredConcepts = selectedCategory 
    ? REACT_CONCEPTS.filter(concept => concept.category === selectedCategory)
    : REACT_CONCEPTS;

  // Calculate progress percentage
  const progressPercentage = REACT_CONCEPTS.length > 0
    ? Math.round((completedLessons.length / REACT_CONCEPTS.length) * 100)
    : 0;

  // Get quiz questions for selected lesson
  const getQuestionsForLesson = (lessonId: string) => {
    return QUIZ_QUESTIONS.filter(q => q.lessonId === lessonId);
  };

  // Check if a lesson has a quiz
  const hasQuiz = (lessonId: string) => {
    return QUIZ_QUESTIONS.some(q => q.lessonId === lessonId);
  };

  // Check if a quiz has been completed
  const isQuizCompleted = (lessonId: string) => {
    return quizResults.some(result => result.lessonId === lessonId && result.completed);
  };

  // Get quiz score for a lesson
  const getQuizScore = (lessonId: string) => {
    const result = quizResults.find(r => r.lessonId === lessonId);
    if (result) {
      return {
        score: result.score,
        total: result.totalQuestions,
        percentage: Math.round((result.score / result.totalQuestions) * 100)
      };
    }
    return null;
  };

  // Get icon component by name
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers size={20} color={COLORS.primary} />;
      case 'ToggleLeft':
        return <ToggleLeft size={20} color={COLORS.primary} />;
      case 'Palette':
        return <Palette size={20} color={COLORS.primary} />;
      case 'Navigation':
        return <Navigation size={20} color={COLORS.primary} />;
      default:
        return <BookOpen size={20} color={COLORS.primary} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>İçerik yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BookOpen size={24} color={COLORS.primary} style={styles.titleIcon} />
          <Text style={styles.title}>React Native Temelleri</Text>
        </View>
        <Text style={styles.subtitle}>
          React Native geliştirme için temel kavramlar, kod örnekleri ve pratik uygulamalar
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>İlerleme: {progressPercentage}%</Text>
          <Text style={styles.progressDetail}>
            {completedLessons.length} / {REACT_CONCEPTS.length} ders tamamlandı
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === null && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <BookOpen size={16} color={selectedCategory === null ? COLORS.white : COLORS.primary} />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === null && styles.selectedCategoryText
              ]}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              {getCategoryIcon(category.icon)}
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredConcepts.map((concept) => (
          <View key={concept.id} style={styles.lessonContainer}>
            <View style={styles.lessonHeader}>
              <TouchableOpacity
                style={styles.completionButton}
                onPress={() => toggleLessonCompletion(concept.id)}
              >
                {completedLessons.includes(concept.id) ? (
                  <CheckCircle size={24} color={COLORS.primary} />
                ) : (
                  <Circle size={24} color={COLORS.textSecondary} />
                )}
              </TouchableOpacity>
              
              <View style={styles.lessonMeta}>
                <View style={styles.categoryBadge}>
                  {getCategoryIcon(
                    CATEGORIES.find(cat => cat.id === concept.category)?.icon || 'BookOpen'
                  )}
                  <Text style={styles.categoryBadgeText}>
                    {CATEGORIES.find(cat => cat.id === concept.category)?.name || 'Genel'}
                  </Text>
                </View>
                
                {hasQuiz(concept.id) && (
                  <View style={[
                    styles.quizBadge,
                    isQuizCompleted(concept.id) && styles.completedQuizBadge
                  ]}>
                    <BookCheck size={14} color={isQuizCompleted(concept.id) ? COLORS.white : COLORS.primary} />
                    <Text style={[
                      styles.quizBadgeText,
                      isQuizCompleted(concept.id) && styles.completedQuizBadgeText
                    ]}>
                      Quiz
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <AccordionItem 
              title={concept.title}
              content={concept.content}
              codeExample={concept.codeExample}
              practiceSection={concept.practiceSection}
              videoId={concept.videoId}
              isCompleted={completedLessons.includes(concept.id)}
              onToggleCompletion={() => toggleLessonCompletion(concept.id)}
            />
            
            {hasQuiz(concept.id) && (
              <View style={styles.quizContainer}>
                <View style={styles.quizInfo}>
                  <View style={styles.quizTitleContainer}>
                    <BookCheck size={18} color={COLORS.primary} />
                    <Text style={styles.quizTitle}>Bilgilerinizi Test Edin</Text>
                  </View>
                  
                  {isQuizCompleted(concept.id) && (
                    <View style={styles.quizScoreContainer}>
                      <Text style={styles.quizScoreText}>
                        Skor: {getQuizScore(concept.id)?.score}/{getQuizScore(concept.id)?.total} ({getQuizScore(concept.id)?.percentage}%)
                      </Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.quizButton,
                    isQuizCompleted(concept.id) && styles.retakeQuizButton
                  ]}
                  onPress={() => openQuizForLesson(concept.id)}
                >
                  <Text style={[
                    styles.quizButtonText,
                    isQuizCompleted(concept.id) && styles.retakeQuizButtonText
                  ]}>
                    {isQuizCompleted(concept.id) ? 'Quizi Tekrar Çöz' : 'Quizi Başlat'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Öğrenmeye Devam Edin!</Text>
          <Text style={styles.footerText}>
            Bu içerik React Native öğrenmenize yardımcı olmak için hazırlanmıştır.
            Daha fazla bilgi için resmi React Native dokümantasyonunu inceleyebilirsiniz.
          </Text>
        </View>
      </ScrollView>
      
      {selectedLessonId && (
        <QuizModal
          visible={quizModalVisible}
          onClose={() => {
            setQuizModalVisible(false);
            // Reload quiz results when modal is closed
            AsyncStorage.getItem(QUIZ_STORAGE_KEY).then(resultsJson => {
              if (resultsJson) {
                setQuizResults(JSON.parse(resultsJson));
              }
            });
          }}
          lessonId={selectedLessonId}
          lessonTitle={selectedLessonTitle}
          questions={getQuestionsForLesson(selectedLessonId)}
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
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  lessonContainer: {
    marginBottom: 16,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionButton: {
    padding: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedQuizBadge: {
    backgroundColor: COLORS.primary,
  },
  quizBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  completedQuizBadgeText: {
    color: COLORS.white,
  },
  quizContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  quizScoreContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quizScoreText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quizButton: {
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
  retakeQuizButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
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
  quizButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  retakeQuizButtonText: {
    color: COLORS.primary,
  },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
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
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});