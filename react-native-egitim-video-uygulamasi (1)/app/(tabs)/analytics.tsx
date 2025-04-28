import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Award, 
  BookOpen,
  Target,
  AlertCircle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { COLORS } from '@/constants/colors';
import { REACT_CONCEPTS, CATEGORIES, PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { QUIZ_STORAGE_KEY } from '@/constants/quizzes';
import { LEARNING_PLANS_STORAGE_KEY } from '@/constants/learning-plans';
import { ACHIEVEMENTS_STORAGE_KEY } from '@/constants/achievements';
import { PROJECT_PROGRESS_KEY } from '@/constants/projects';

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [learningPlan, setLearningPlan] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [projectProgress, setProjectProgress] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
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
      
      // Load learning plan
      const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
      if (storedPlan) {
        setLearningPlan(JSON.parse(storedPlan));
      }
      
      // Load achievements
      const storedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
      
      // Load project progress
      const storedProjectProgress = await AsyncStorage.getItem(PROJECT_PROGRESS_KEY);
      if (storedProjectProgress) {
        setProjectProgress(JSON.parse(storedProjectProgress));
      }
      
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Switch tabs with haptic feedback
  const switchTab = (tab: string) => {
    setActiveTab(tab);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    return REACT_CONCEPTS.length > 0
      ? Math.round((completedLessons.length / REACT_CONCEPTS.length) * 100)
      : 0;
  };
  
  // Calculate category completion percentages
  const calculateCategoryProgress = () => {
    const categoryProgress: Record<string, { completed: number, total: number }> = {};
    
    // Initialize categories
    CATEGORIES.forEach(category => {
      categoryProgress[category.id] = { completed: 0, total: 0 };
    });
    
    // Count lessons by category
    REACT_CONCEPTS.forEach(concept => {
      if (categoryProgress[concept.category]) {
        categoryProgress[concept.category].total += 1;
        
        if (completedLessons.includes(concept.id)) {
          categoryProgress[concept.category].completed += 1;
        }
      }
    });
    
    return categoryProgress;
  };
  
  // Calculate quiz performance
  const calculateQuizPerformance = () => {
    if (quizResults.length === 0) return { average: 0, total: 0, best: 0, worst: 0 };
    
    let totalScore = 0;
    let totalQuestions = 0;
    let bestScore = 0;
    let worstScore = 100;
    
    quizResults.forEach(result => {
      const percentage = Math.round((result.score / result.totalQuestions) * 100);
      totalScore += percentage;
      totalQuestions += 1;
      
      if (percentage > bestScore) bestScore = percentage;
      if (percentage < worstScore) worstScore = percentage;
    });
    
    return {
      average: Math.round(totalScore / quizResults.length),
      total: quizResults.length,
      best: bestScore,
      worst: worstScore
    };
  };
  
  // Calculate project completion
  const calculateProjectCompletion = () => {
    const totalProjects = Object.keys(projectProgress).length;
    let completedProjects = 0;
    let totalSteps = 0;
    let completedSteps = 0;
    
    Object.entries(projectProgress).forEach(([projectId, steps]) => {
      // Get project from constants
      const project = { steps: [] }; // Placeholder, you'd get this from your projects constant
      
      if (project && project.steps) {
        totalSteps += project.steps.length;
        completedSteps += steps.length;
        
        if (steps.length === project.steps.length) {
          completedProjects += 1;
        }
      }
    });
    
    return {
      totalProjects,
      completedProjects,
      totalSteps,
      completedSteps,
      percentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    };
  };
  
  // Identify strengths and weaknesses
  const identifyStrengthsAndWeaknesses = () => {
    const categoryProgress = calculateCategoryProgress();
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Analyze category progress
    Object.entries(categoryProgress).forEach(([categoryId, progress]) => {
      const percentage = progress.total > 0 
        ? Math.round((progress.completed / progress.total) * 100) 
        : 0;
      
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (category) {
        if (percentage >= 70) {
          strengths.push(category.name);
        } else if (percentage <= 30 && progress.total > 0) {
          weaknesses.push(category.name);
        }
      }
    });
    
    // Analyze quiz performance
    const quizPerformance = calculateQuizPerformance();
    if (quizPerformance.average >= 80) {
      strengths.push('Quiz Performansı');
    } else if (quizPerformance.average <= 50 && quizPerformance.total > 0) {
      weaknesses.push('Quiz Performansı');
    }
    
    // Analyze project completion
    const projectCompletion = calculateProjectCompletion();
    if (projectCompletion.percentage >= 70) {
      strengths.push('Proje Tamamlama');
    } else if (projectCompletion.percentage <= 30 && projectCompletion.totalProjects > 0) {
      weaknesses.push('Proje Tamamlama');
    }
    
    // Analyze streak
    if (learningPlan && learningPlan.streakDays >= 7) {
      strengths.push('Düzenli Çalışma');
    } else if (learningPlan && learningPlan.streakDays <= 2) {
      weaknesses.push('Düzenli Çalışma');
    }
    
    return { strengths, weaknesses };
  };
  
  // Get learning recommendations
  const getLearningRecommendations = () => {
    const { strengths, weaknesses } = identifyStrengthsAndWeaknesses();
    const recommendations: string[] = [];
    
    // Add recommendations based on weaknesses
    if (weaknesses.includes('Quiz Performansı')) {
      recommendations.push('Quiz performansınızı artırmak için konuları tekrar gözden geçirin.');
    }
    
    if (weaknesses.includes('Proje Tamamlama')) {
      recommendations.push('Pratik becerilerinizi geliştirmek için daha fazla proje üzerinde çalışın.');
    }
    
    if (weaknesses.includes('Düzenli Çalışma')) {
      recommendations.push('Düzenli çalışma alışkanlığı geliştirmek için günlük öğrenme hedefleri belirleyin.');
    }
    
    // Add category-specific recommendations
    CATEGORIES.forEach(category => {
      if (weaknesses.includes(category.name)) {
        recommendations.push(`${category.name} konularında daha fazla çalışın.`);
      }
    });
    
    // Add general recommendations
    if (recommendations.length === 0) {
      if (strengths.length > 0) {
        recommendations.push('Güçlü olduğunuz alanlarda ileri seviye konulara geçebilirsiniz.');
      } else {
        recommendations.push('Tüm alanlarda dengeli bir şekilde ilerlemeye devam edin.');
      }
    }
    
    // Add streak recommendation if needed
    if (!learningPlan || learningPlan.streakDays < 3) {
      recommendations.push('Düzenli çalışma alışkanlığı geliştirmek için her gün en az bir ders tamamlamayı hedefleyin.');
    }
    
    return recommendations;
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BarChart2 size={24} color={COLORS.primary} style={styles.titleIcon} />
          <Text style={styles.title}>Öğrenme Analitiği</Text>
        </View>
        <Text style={styles.subtitle}>
          İlerlemenizi takip edin, güçlü ve zayıf yönlerinizi keşfedin
        </Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'overview' && styles.activeTabButton
            ]}
            onPress={() => switchTab('overview')}
          >
            <BarChart2 
              size={18} 
              color={activeTab === 'overview' ? COLORS.white : COLORS.primary} 
            />
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'overview' && styles.activeTabButtonText
              ]}
            >
              Genel Bakış
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'progress' && styles.activeTabButton
            ]}
            onPress={() => switchTab('progress')}
          >
            <TrendingUp 
              size={18} 
              color={activeTab === 'progress' ? COLORS.white : COLORS.primary} 
            />
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'progress' && styles.activeTabButtonText
              ]}
            >
              İlerleme
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'strengths' && styles.activeTabButton
            ]}
            onPress={() => switchTab('strengths')}
          >
            <Award 
              size={18} 
              color={activeTab === 'strengths' ? COLORS.white : COLORS.primary} 
            />
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'strengths' && styles.activeTabButtonText
              ]}
            >
              Güçlü/Zayıf Yönler
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'recommendations' && styles.activeTabButton
            ]}
            onPress={() => switchTab('recommendations')}
          >
            <Target 
              size={18} 
              color={activeTab === 'recommendations' ? COLORS.white : COLORS.primary} 
            />
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'recommendations' && styles.activeTabButtonText
              ]}
            >
              Öneriler
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <BookOpen size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.statValue}>{completedLessons.length}</Text>
                <Text style={styles.statLabel}>Tamamlanan Ders</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Award size={24} color="#FF9800" />
                </View>
                <Text style={styles.statValue}>{achievements.length}</Text>
                <Text style={styles.statLabel}>Kazanılan Başarı</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Calendar size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statValue}>
                  {learningPlan ? learningPlan.streakDays : 0}
                </Text>
                <Text style={styles.statLabel}>Gün Seri</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Clock size={24} color="#9C27B0" />
                </View>
                <Text style={styles.statValue}>
                  {quizResults.length}
                </Text>
                <Text style={styles.statLabel}>Çözülen Quiz</Text>
              </View>
            </View>
            
            <View style={styles.progressOverview}>
              <Text style={styles.sectionTitle}>Genel İlerleme</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${calculateProgress()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {calculateProgress()}% tamamlandı
              </Text>
            </View>
            
            <View style={styles.categoryProgress}>
              <Text style={styles.sectionTitle}>Kategori Bazında İlerleme</Text>
              
              {Object.entries(calculateCategoryProgress()).map(([categoryId, progress]) => {
                const category = CATEGORIES.find(c => c.id === categoryId);
                const percentage = progress.total > 0 
                  ? Math.round((progress.completed / progress.total) * 100) 
                  : 0;
                
                return (
                  <View key={categoryId} style={styles.categoryProgressItem}>
                    <View style={styles.categoryProgressHeader}>
                      <Text style={styles.categoryName}>{category?.name || categoryId}</Text>
                      <Text style={styles.categoryProgressText}>
                        {progress.completed}/{progress.total} ({percentage}%)
                      </Text>
                    </View>
                    <View style={styles.categoryProgressBar}>
                      <View 
                        style={[
                          styles.categoryProgressFill, 
                          { width: `${percentage}%` }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.quizPerformance}>
              <Text style={styles.sectionTitle}>Quiz Performansı</Text>
              
              {quizResults.length > 0 ? (
                <View style={styles.quizStats}>
                  <View style={styles.quizStatItem}>
                    <Text style={styles.quizStatValue}>
                      {calculateQuizPerformance().average}%
                    </Text>
                    <Text style={styles.quizStatLabel}>Ortalama</Text>
                  </View>
                  
                  <View style={styles.quizStatItem}>
                    <Text style={styles.quizStatValue}>
                      {calculateQuizPerformance().best}%
                    </Text>
                    <Text style={styles.quizStatLabel}>En İyi</Text>
                  </View>
                  
                  <View style={styles.quizStatItem}>
                    <Text style={styles.quizStatValue}>
                      {calculateQuizPerformance().worst}%
                    </Text>
                    <Text style={styles.quizStatLabel}>En Düşük</Text>
                  </View>
                  
                  <View style={styles.quizStatItem}>
                    <Text style={styles.quizStatValue}>
                      {calculateQuizPerformance().total}
                    </Text>
                    <Text style={styles.quizStatLabel}>Toplam</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Henüz hiç quiz çözmediniz.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        
        {activeTab === 'progress' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Ders İlerlemesi</Text>
              <View style={styles.progressDetail}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressCircleValue}>{calculateProgress()}%</Text>
                </View>
                <View style={styles.progressStats}>
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatLabel}>Tamamlanan:</Text>
                    <Text style={styles.progressStatValue}>{completedLessons.length}</Text>
                  </View>
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatLabel}>Toplam:</Text>
                    <Text style={styles.progressStatValue}>{REACT_CONCEPTS.length}</Text>
                  </View>
                  <View style={styles.progressStat}>
                    <Text style={styles.progressStatLabel}>Kalan:</Text>
                    <Text style={styles.progressStatValue}>
                      {REACT_CONCEPTS.length - completedLessons.length}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Zaman İçinde İlerleme</Text>
              
              {learningPlan ? (
                <View style={styles.timeProgress}>
                  <View style={styles.timeProgressItem}>
                    <Text style={styles.timeProgressLabel}>Günlük Seri:</Text>
                    <Text style={styles.timeProgressValue}>{learningPlan.streakDays} gün</Text>
                  </View>
                  
                  <View style={styles.timeProgressItem}>
                    <Text style={styles.timeProgressLabel}>Haftalık Hedef:</Text>
                    <Text style={styles.timeProgressValue}>
                      {learningPlan.weeklyGoal} ders/hafta
                    </Text>
                  </View>
                  
                  <View style={styles.timeProgressItem}>
                    <Text style={styles.timeProgressLabel}>Seviye:</Text>
                    <Text style={styles.timeProgressValue}>
                      {learningPlan.level === 'beginner' ? 'Başlangıç' :
                       learningPlan.level === 'intermediate' ? 'Orta' : 'İleri'}
                    </Text>
                  </View>
                  
                  <View style={styles.timeProgressItem}>
                    <Text style={styles.timeProgressLabel}>Çalışma Günleri:</Text>
                    <Text style={styles.timeProgressValue}>
                      {learningPlan.studyDays.length} gün/hafta
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Henüz bir öğrenme planı oluşturmadınız.
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Kategori Dağılımı</Text>
              
              <View style={styles.categoryDistribution}>
                {Object.entries(calculateCategoryProgress()).map(([categoryId, progress]) => {
                  const category = CATEGORIES.find(c => c.id === categoryId);
                  const percentage = progress.total > 0 
                    ? Math.round((progress.completed / progress.total) * 100) 
                    : 0;
                  
                  return (
                    <View key={categoryId} style={styles.categoryDistributionItem}>
                      <View style={styles.categoryDistributionHeader}>
                        <Text style={styles.categoryDistributionName}>
                          {category?.name || categoryId}
                        </Text>
                        <Text style={styles.categoryDistributionPercentage}>
                          {percentage}%
                        </Text>
                      </View>
                      <View style={styles.categoryDistributionBar}>
                        <View 
                          style={[
                            styles.categoryDistributionFill, 
                            { width: `${percentage}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'strengths' && (
          <View style={styles.strengthsContainer}>
            <View style={styles.strengthsCard}>
              <Text style={styles.strengthsCardTitle}>Güçlü Yönleriniz</Text>
              
              {identifyStrengthsAndWeaknesses().strengths.length > 0 ? (
                <View style={styles.strengthsList}>
                  {identifyStrengthsAndWeaknesses().strengths.map((strength, index) => (
                    <View key={index} style={styles.strengthItem}>
                      <Award size={20} color="#4CAF50" style={styles.strengthIcon} />
                      <Text style={styles.strengthText}>{strength}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Henüz belirgin güçlü yönleriniz tespit edilemedi. Daha fazla ders tamamlayarak ve quiz çözerek güçlü yönlerinizi keşfedin.
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.weaknessesCard}>
              <Text style={styles.weaknessesCardTitle}>Geliştirilmesi Gereken Yönleriniz</Text>
              
              {identifyStrengthsAndWeaknesses().weaknesses.length > 0 ? (
                <View style={styles.weaknessesList}>
                  {identifyStrengthsAndWeaknesses().weaknesses.map((weakness, index) => (
                    <View key={index} style={styles.weaknessItem}>
                      <AlertCircle size={20} color="#F44336" style={styles.weaknessIcon} />
                      <Text style={styles.weaknessText}>{weakness}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Harika! Şu an için belirgin zayıf yönleriniz tespit edilemedi. Dengeli bir şekilde ilerlemeye devam edin.
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Detaylı Analiz</Text>
              
              <View style={styles.analysisSection}>
                <Text style={styles.analysisSectionTitle}>Ders Tamamlama</Text>
                <Text style={styles.analysisText}>
                  Toplam {REACT_CONCEPTS.length} dersin {completedLessons.length} tanesini tamamladınız ({calculateProgress()}%). 
                  {calculateProgress() < 30 ? ' Henüz yolun başındasınız.' :
                   calculateProgress() < 70 ? ' İyi bir ilerleme kaydediyorsunuz.' :
                   ' Harika bir ilerleme kaydettiniz!'}
                </Text>
              </View>
              
              <View style={styles.analysisSection}>
                <Text style={styles.analysisSectionTitle}>Quiz Performansı</Text>
                {quizResults.length > 0 ? (
                  <Text style={styles.analysisText}>
                    Toplam {quizResults.length} quiz çözdünüz ve ortalama başarı oranınız {calculateQuizPerformance().average}%. 
                    {calculateQuizPerformance().average < 50 ? ' Quiz performansınızı artırmak için konuları tekrar gözden geçirmelisiniz.' :
                     calculateQuizPerformance().average < 80 ? ' İyi bir quiz performansı gösteriyorsunuz.' :
                     ' Mükemmel bir quiz performansı gösteriyorsunuz!'}
                  </Text>
                ) : (
                  <Text style={styles.analysisText}>
                    Henüz hiç quiz çözmediniz. Bilgilerinizi test etmek için quizleri çözmeyi deneyin.
                  </Text>
                )}
              </View>
              
              <View style={styles.analysisSection}>
                <Text style={styles.analysisSectionTitle}>Çalışma Düzeni</Text>
                {learningPlan ? (
                  <Text style={styles.analysisText}>
                    {learningPlan.streakDays} günlük bir çalışma seriniz var. 
                    {learningPlan.streakDays < 3 ? ' Düzenli çalışma alışkanlığı geliştirmelisiniz.' :
                     learningPlan.streakDays < 7 ? ' İyi bir çalışma düzeni oluşturuyorsunuz.' :
                     ' Harika bir çalışma düzeni oluşturdunuz!'}
                  </Text>
                ) : (
                  <Text style={styles.analysisText}>
                    Henüz bir öğrenme planı oluşturmadınız. Düzenli çalışma alışkanlığı geliştirmek için bir plan oluşturmanızı öneririz.
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'recommendations' && (
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsCard}>
              <Text style={styles.recommendationsCardTitle}>Öğrenme Önerileri</Text>
              
              <View style={styles.recommendationsList}>
                {getLearningRecommendations().map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Target size={20} color={COLORS.primary} style={styles.recommendationIcon} />
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsCardTitle}>Sonraki Adımlar</Text>
              
              <View style={styles.nextStepsList}>
                {completedLessons.length < REACT_CONCEPTS.length && (
                  <View style={styles.nextStepItem}>
                    <BookOpen size={20} color="#4CAF50" style={styles.nextStepIcon} />
                    <View style={styles.nextStepContent}>
                      <Text style={styles.nextStepTitle}>Derslere Devam Edin</Text>
                      <Text style={styles.nextStepDescription}>
                        {REACT_CONCEPTS.length - completedLessons.length} ders kaldı. Öğrenmeye devam edin.
                      </Text>
                    </View>
                  </View>
                )}
                
                {quizResults.length < REACT_CONCEPTS.length && (
                  <View style={styles.nextStepItem}>
                    <Award size={20} color="#FF9800" style={styles.nextStepIcon} />
                    <View style={styles.nextStepContent}>
                      <Text style={styles.nextStepTitle}>Quizleri Çözün</Text>
                      <Text style={styles.nextStepDescription}>
                        Bilgilerinizi test etmek için quizleri çözün.
                      </Text>
                    </View>
                  </View>
                )}
                
                {(!learningPlan || learningPlan.streakDays < 7) && (
                  <View style={styles.nextStepItem}>
                    <Calendar size={20} color="#9C27B0" style={styles.nextStepIcon} />
                    <View style={styles.nextStepContent}>
                      <Text style={styles.nextStepTitle}>Düzenli Çalışın</Text>
                      <Text style={styles.nextStepDescription}>
                        Düzenli çalışma alışkanlığı geliştirin ve serinizi koruyun.
                      </Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.nextStepItem}>
                  <Target size={20} color="#F44336" style={styles.nextStepIcon} />
                  <View style={styles.nextStepContent}>
                    <Text style={styles.nextStepTitle}>Hedeflerinizi Belirleyin</Text>
                    <Text style={styles.nextStepDescription}>
                      Uzun vadeli hedefler belirleyin ve ilerlemenizi takip edin.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.longTermGoalsCard}>
              <Text style={styles.longTermGoalsCardTitle}>Uzun Vadeli Hedefler</Text>
              
              <View style={styles.longTermGoalsList}>
                <View style={styles.longTermGoalItem}>
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
                
                <View style={styles.longTermGoalItem}>
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
            </View>
          </View>
        )}
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
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  activeTabButtonText: {
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
  
  // Overview Tab Styles
  overviewContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressOverview: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
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
  categoryProgress: {
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
  categoryProgressItem: {
    marginBottom: 16,
  },
  categoryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  categoryProgressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  categoryProgressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  quizPerformance: {
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
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStatItem: {
    alignItems: 'center',
  },
  quizStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  quizStatLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Progress Tab Styles
  progressContainer: {
    flex: 1,
  },
  progressCard: {
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
  progressCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  progressDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressCircleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressStats: {
    flex: 1,
  },
  progressStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStatLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  timeProgress: {
    marginTop: 8,
  },
  timeProgressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timeProgressLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeProgressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryDistribution: {
    marginTop: 8,
  },
  categoryDistributionItem: {
    marginBottom: 16,
  },
  categoryDistributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDistributionName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  categoryDistributionPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoryDistributionBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryDistributionFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  
  // Strengths Tab Styles
  strengthsContainer: {
    flex: 1,
  },
  strengthsCard: {
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
  strengthsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  strengthsList: {
    marginTop: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  strengthIcon: {
    marginRight: 12,
  },
  strengthText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  weaknessesCard: {
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
  weaknessesCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  weaknessesList: {
    marginTop: 8,
  },
  weaknessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  weaknessIcon: {
    marginRight: 12,
  },
  weaknessText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  analysisCard: {
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
  analysisCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  analysisSection: {
    marginBottom: 16,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  
  // Recommendations Tab Styles
  recommendationsContainer: {
    flex: 1,
  },
  recommendationsCard: {
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
  recommendationsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  recommendationsList: {
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  nextStepsCard: {
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
  nextStepsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  nextStepsList: {
    marginTop: 8,
  },
  nextStepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nextStepIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  nextStepDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  longTermGoalsCard: {
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
  longTermGoalsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  longTermGoalsList: {
    marginTop: 8,
  },
  longTermGoalItem: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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