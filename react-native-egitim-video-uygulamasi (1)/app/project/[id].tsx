import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { 
  Code, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle, 
  Clock, 
  Award,
  Share2
} from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { PROJECTS, PROJECT_PROGRESS_KEY, ProjectStep } from '@/constants/projects';
import CodePlayground from '@/components/CodePlayground';
import { 
  ACHIEVEMENTS_STORAGE_KEY, 
  checkForNewAchievements 
} from '@/constants/achievements';
import { PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { QUIZ_STORAGE_KEY } from '@/constants/quizzes';
import { LEARNING_PLANS_STORAGE_KEY, updateStreak } from '@/constants/learning-plans';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Find project by id
  const project = PROJECTS.find(p => p.id === id);
  
  // Load completed steps from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const storedProgress = await AsyncStorage.getItem(PROJECT_PROGRESS_KEY);
        
        if (storedProgress) {
          const allProgress = JSON.parse(storedProgress);
          const projectProgress = allProgress[id] || [];
          setCompletedSteps(projectProgress);
          
          // Set current step to the first incomplete step
          if (projectProgress.length > 0 && projectProgress.length < project?.steps.length) {
            // Find the first step that is not completed
            const firstIncompleteIndex = project?.steps.findIndex(
              step => !projectProgress.includes(step.id)
            );
            
            if (firstIncompleteIndex !== undefined && firstIncompleteIndex !== -1) {
              setCurrentStepIndex(firstIncompleteIndex);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load project progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (project) {
      loadProgress();
    }
  }, [id, project]);
  
  // Save completed steps to AsyncStorage
  const saveProgress = async (updatedSteps: string[]) => {
    try {
      // Get existing progress
      const storedProgress = await AsyncStorage.getItem(PROJECT_PROGRESS_KEY);
      let allProgress: Record<string, string[]> = storedProgress ? JSON.parse(storedProgress) : {};
      
      // Update progress for this project
      allProgress[id] = updatedSteps;
      
      // Save updated progress
      await AsyncStorage.setItem(PROJECT_PROGRESS_KEY, JSON.stringify(allProgress));
      
      // Check if this is the first time completing a step today
      // If so, update streak
      if (updatedSteps.length > completedSteps.length) {
        const storedPlan = await AsyncStorage.getItem(LEARNING_PLANS_STORAGE_KEY);
        if (storedPlan) {
          const plan = JSON.parse(storedPlan);
          const updatedPlan = updateStreak(plan);
          await AsyncStorage.setItem(LEARNING_PLANS_STORAGE_KEY, JSON.stringify(updatedPlan));
        }
        
        // Check for new achievements
        await checkForAchievements();
      }
    } catch (error) {
      console.error('Failed to save project progress:', error);
    }
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
        0, // Not relevant for this check
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
  
  // Toggle step completion
  const toggleStepCompletion = (stepId: string) => {
    let updatedSteps: string[];
    
    if (completedSteps.includes(stepId)) {
      // Remove from completed steps
      updatedSteps = completedSteps.filter(id => id !== stepId);
    } else {
      // Add to completed steps
      updatedSteps = [...completedSteps, stepId];
      
      // Provide haptic feedback when marking as completed
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // If all steps are completed, show congratulations message
      if (project && updatedSteps.length === project.steps.length) {
        setTimeout(() => {
          Alert.alert(
            "Tebrikler!",
            `"${project.title}" projesini başarıyla tamamladınız!`,
            [{ text: "Teşekkürler" }]
          );
        }, 500);
      }
    }
    
    setCompletedSteps(updatedSteps);
    saveProgress(updatedSteps);
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    if (project && currentStepIndex < project.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      scrollToTop();
      
      // Provide haptic feedback when navigating
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      scrollToTop();
      
      // Provide haptic feedback when navigating
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  // Scroll to top of the screen
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay':
        return '#4CAF50';
      case 'Orta':
        return '#FF9800';
      case 'Zor':
        return '#F44336';
      default:
        return COLORS.primary;
    }
  };
  
  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Proje bulunamadı</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const currentStep = project.steps[currentStepIndex];
  const isStepCompleted = completedSteps.includes(currentStep.id);
  const completionPercentage = Math.round((completedSteps.length / project.steps.length) * 100);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: project.title,
          headerBackTitle: "Projeler",
          headerRight: () => (
            Platform.OS !== 'web' ? (
              <TouchableOpacity style={styles.headerButton}>
                <Share2 size={22} color={COLORS.primary} />
              </TouchableOpacity>
            ) : null
          ),
        }} 
      />
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <StatusBar style="dark" />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Proje yükleniyor...</Text>
          </View>
        ) : (
          <>
            <View style={styles.progressHeader}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${completionPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {completedSteps.length} / {project.steps.length} adım tamamlandı ({completionPercentage}%)
              </Text>
            </View>
            
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Image 
                source={{ uri: project.image }} 
                style={styles.projectImage}
                resizeMode="cover"
              />
              
              <View style={styles.projectInfo}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                
                <View style={styles.projectMeta}>
                  <View 
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(project.difficulty) + '20', 
                        borderColor: getDifficultyColor(project.difficulty) }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(project.difficulty) }
                      ]}
                    >
                      {project.difficulty}
                    </Text>
                  </View>
                  
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{project.category}</Text>
                  </View>
                  
                  {project.estimatedHours && (
                    <View style={styles.timeBadge}>
                      <Clock size={14} color={COLORS.textSecondary} />
                      <Text style={styles.timeText}>~{project.estimatedHours} saat</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.projectDescription}>{project.description}</Text>
                
                <View style={styles.projectGoals}>
                  <Text style={styles.goalsTitle}>Bu Projede Öğrenecekleriniz:</Text>
                  {project.learningGoals.map((goal, index) => (
                    <View key={index} style={styles.goalItem}>
                      <Award size={16} color={COLORS.primary} style={styles.goalIcon} />
                      <Text style={styles.goalText}>{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>
                    Adım {currentStepIndex + 1}: {currentStep.title}
                  </Text>
                  <TouchableOpacity
                    style={styles.completionButton}
                    onPress={() => toggleStepCompletion(currentStep.id)}
                  >
                    {isStepCompleted ? (
                      <CheckCircle size={24} color={COLORS.primary} />
                    ) : (
                      <Circle size={24} color={COLORS.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.stepDescription}>{currentStep.description}</Text>
                
                {currentStep.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
                
                {currentStep.codeExample && (
                  <View style={styles.codeExampleContainer}>
                    <Text style={styles.codeExampleTitle}>Örnek Kod:</Text>
                    <CodePlayground
                      title={`${currentStep.title} - Örnek`}
                      initialCode={currentStep.codeExample}
                      snippetId={`project_${project.id}_step_${currentStep.id}`}
                    />
                  </View>
                )}
                
                {currentStep.challenge && (
                  <View style={styles.challengeContainer}>
                    <Text style={styles.challengeTitle}>Kodlama Görevi:</Text>
                    <Text style={styles.challengeDescription}>{currentStep.challenge.description}</Text>
                    
                    <CodePlayground
                      title="Kodlama Görevi"
                      description={currentStep.challenge.hint}
                      initialCode={currentStep.challenge.starterCode}
                      snippetId={`project_${project.id}_challenge_${currentStep.id}`}
                    />
                  </View>
                )}
                
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      styles.prevButton,
                      currentStepIndex === 0 && styles.disabledButton
                    ]}
                    onPress={goToPrevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ChevronLeft size={20} color={currentStepIndex === 0 ? COLORS.textSecondary : COLORS.primary} />
                    <Text 
                      style={[
                        styles.navButtonText,
                        styles.prevButtonText,
                        currentStepIndex === 0 && styles.disabledButtonText
                      ]}
                    >
                      Önceki
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      styles.completeButton,
                      isStepCompleted && styles.completedButton
                    ]}
                    onPress={() => toggleStepCompletion(currentStep.id)}
                  >
                    {isStepCompleted ? (
                      <>
                        <CheckCircle size={20} color={COLORS.white} />
                        <Text style={styles.completeButtonText}>Tamamlandı</Text>
                      </>
                    ) : (
                      <Text style={styles.completeButtonText}>Adımı Tamamla</Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      styles.nextButton,
                      currentStepIndex === project.steps.length - 1 && styles.disabledButton
                    ]}
                    onPress={goToNextStep}
                    disabled={currentStepIndex === project.steps.length - 1}
                  >
                    <Text 
                      style={[
                        styles.navButtonText,
                        styles.nextButtonText,
                        currentStepIndex === project.steps.length - 1 && styles.disabledButtonText
                      ]}
                    >
                      Sonraki
                    </Text>
                    <ChevronRight 
                      size={20} 
                      color={currentStepIndex === project.steps.length - 1 ? COLORS.textSecondary : COLORS.primary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.stepsOverview}>
                <Text style={styles.stepsOverviewTitle}>Tüm Adımlar</Text>
                
                {project.steps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <TouchableOpacity
                      key={step.id}
                      style={[
                        styles.stepItem,
                        isCompleted && styles.completedStepItem,
                        isCurrent && styles.currentStepItem
                      ]}
                      onPress={() => {
                        setCurrentStepIndex(index);
                        scrollToTop();
                      }}
                    >
                      <View style={styles.stepItemContent}>
                        <Text style={styles.stepItemNumber}>{index + 1}</Text>
                        <Text 
                          style={[
                            styles.stepItemTitle,
                            isCompleted && styles.completedStepItemTitle,
                            isCurrent && styles.currentStepItemTitle
                          ]}
                          numberOfLines={1}
                        >
                          {step.title}
                        </Text>
                      </View>
                      
                      {isCompleted ? (
                        <CheckCircle size={20} color={COLORS.primary} />
                      ) : (
                        <Circle size={20} color={isCurrent ? COLORS.primary : COLORS.textSecondary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  progressHeader: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  projectImage: {
    width: '100%',
    height: 200,
  },
  projectInfo: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  projectDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  projectGoals: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  goalText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  stepContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 16,
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
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
  completionButton: {
    padding: 4,
  },
  stepDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  codeExampleContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  codeExampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  challengeContainer: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  prevButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  nextButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
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
  completedButton: {
    backgroundColor: COLORS.primaryLight,
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
  disabledButton: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  prevButtonText: {
    color: COLORS.primary,
    marginLeft: 4,
  },
  nextButtonText: {
    color: COLORS.primary,
    marginRight: 4,
  },
  completeButtonText: {
    color: COLORS.white,
    marginLeft: 4,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
  },
  stepsOverview: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 16,
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
  stepsOverviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    marginBottom: 8,
  },
  completedStepItem: {
    backgroundColor: COLORS.primaryLight + '40',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  currentStepItem: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  stepItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepItemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textSecondary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 12,
  },
  stepItemTitle: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  completedStepItemTitle: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  currentStepItemTitle: {
    fontWeight: '600',
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