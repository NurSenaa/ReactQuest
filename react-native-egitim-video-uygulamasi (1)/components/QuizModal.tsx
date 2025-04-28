import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';
import { QuizQuestion, QuizResult, QUIZ_STORAGE_KEY } from '@/constants/quizzes';
import { 
  ACHIEVEMENTS_STORAGE_KEY, 
  checkForNewAchievements 
} from '@/constants/achievements';
import { PROGRESS_STORAGE_KEY } from '@/constants/react-concepts';
import { LEARNING_PLANS_STORAGE_KEY } from '@/constants/learning-plans';
import { REACT_CONCEPTS } from '@/constants/react-concepts';

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
}

export default function QuizModal({ 
  visible, 
  onClose, 
  lessonId, 
  lessonTitle, 
  questions 
}: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [previousResults, setPreviousResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Load previous quiz results
  useEffect(() => {
    if (visible) {
      loadPreviousResults();
    } else {
      // Reset state when modal is closed
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setCorrectAnswers(0);
      setQuizCompleted(false);
    }
  }, [visible, lessonId]);

  const loadPreviousResults = async () => {
    try {
      setLoading(true);
      const resultsJson = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      if (resultsJson) {
        const allResults = JSON.parse(resultsJson) as QuizResult[];
        const result = allResults.find(r => r.lessonId === lessonId);
        if (result) {
          setPreviousResults(result);
        } else {
          setPreviousResults(null);
        }
      } else {
        setPreviousResults(null);
      }
    } catch (error) {
      console.error('Failed to load quiz results:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuizResult = async () => {
    try {
      const score = correctAnswers;
      const result: QuizResult = {
        lessonId,
        completed: true,
        score,
        totalQuestions,
        date: new Date().toISOString(),
      };

      const resultsJson = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
      let allResults: QuizResult[] = resultsJson ? JSON.parse(resultsJson) : [];
      
      // Update or add new result
      const existingIndex = allResults.findIndex(r => r.lessonId === lessonId);
      if (existingIndex >= 0) {
        allResults[existingIndex] = result;
      } else {
        allResults.push(result);
      }

      await AsyncStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(allResults));
      setPreviousResults(result);
      
      // Check for new achievements
      await checkForAchievements();
      
    } catch (error) {
      console.error('Failed to save quiz result:', error);
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
        } else if (newAchievements.length > 1) {
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

  const handleOptionSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOptionIndex(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return;

    setIsAnswerSubmitted(true);
    
    // Check if answer is correct
    if (selectedOptionIndex === currentQuestion.correctOptionIndex) {
      setCorrectAnswers(prev => prev + 1);
      
      // Provide haptic feedback for correct answer
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      // Provide haptic feedback for wrong answer
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
      saveQuizResult();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Quiz yükleniyor...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // Show previous results if available
  if (previousResults && !quizCompleted) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quiz Sonuçları</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.previousResultsContainer}>
              <Text style={styles.previousResultsTitle}>Önceki Quiz Sonucunuz</Text>
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {previousResults.score} / {previousResults.totalQuestions}
                </Text>
                <Text style={styles.scorePercentage}>
                  {Math.round((previousResults.score / previousResults.totalQuestions) * 100)}%
                </Text>
              </View>
              
              <View style={styles.resultDateContainer}>
                <Text style={styles.resultDateText}>
                  Tamamlanma: {new Date(previousResults.date).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.restartButton]} 
                onPress={restartQuiz}
              >
                <Text style={styles.buttonText}>Quizi Tekrar Çöz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.closeModalButton]} 
                onPress={onClose}
              >
                <Text style={styles.closeModalButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Show quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = percentage >= 70;
    
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quiz Tamamlandı</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.resultContainer}>
              {isPassed ? (
                <View style={styles.successIcon}>
                  <CheckCircle size={60} color={COLORS.primary} />
                </View>
              ) : (
                <View style={styles.failIcon}>
                  <AlertCircle size={60} color={COLORS.secondary} />
                </View>
              )}
              
              <Text style={[
                styles.resultTitle,
                isPassed ? styles.successText : styles.failText
              ]}>
                {isPassed ? 'Tebrikler!' : 'Tekrar Deneyin'}
              </Text>
              
              <Text style={styles.resultSubtitle}>
                {isPassed 
                  ? 'Bu konuyu başarıyla tamamladınız.' 
                  : 'Konuyu tekrar gözden geçirmenizi öneririz.'}
              </Text>
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {correctAnswers} / {totalQuestions}
                </Text>
                <Text style={[
                  styles.scorePercentage,
                  isPassed ? styles.successText : styles.failText
                ]}>
                  {percentage}%
                </Text>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.restartButton]} 
                onPress={restartQuiz}
              >
                <Text style={styles.buttonText}>Quizi Tekrar Çöz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.closeModalButton]} 
                onPress={onClose}
              >
                <Text style={styles.closeModalButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Show quiz questions
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{lessonTitle}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Soru {currentQuestionIndex + 1} / {totalQuestions}
            </Text>
          </View>

          <ScrollView style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>
            
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOptionIndex === index && styles.selectedOption,
                  isAnswerSubmitted && index === currentQuestion.correctOptionIndex && styles.correctOption,
                  isAnswerSubmitted && selectedOptionIndex === index && 
                    index !== currentQuestion.correctOptionIndex && styles.wrongOption
                ]}
                onPress={() => handleOptionSelect(index)}
                disabled={isAnswerSubmitted}
              >
                <Text style={[
                  styles.optionText,
                  selectedOptionIndex === index && styles.selectedOptionText,
                  isAnswerSubmitted && index === currentQuestion.correctOptionIndex && styles.correctOptionText,
                  isAnswerSubmitted && selectedOptionIndex === index && 
                    index !== currentQuestion.correctOptionIndex && styles.wrongOptionText
                ]}>
                  {option}
                </Text>
                
                {isAnswerSubmitted && index === currentQuestion.correctOptionIndex && (
                  <CheckCircle size={20} color={COLORS.white} style={styles.optionIcon} />
                )}
                
                {isAnswerSubmitted && selectedOptionIndex === index && 
                  index !== currentQuestion.correctOptionIndex && (
                  <XCircle size={20} color={COLORS.white} style={styles.optionIcon} />
                )}
              </TouchableOpacity>
            ))}
            
            {isAnswerSubmitted && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>
                  {selectedOptionIndex === currentQuestion.correctOptionIndex 
                    ? 'Doğru!' 
                    : 'Yanlış!'}
                </Text>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.actionContainer}>
            {!isAnswerSubmitted ? (
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  selectedOptionIndex === null && styles.disabledButton
                ]}
                onPress={handleSubmitAnswer}
                disabled={selectedOptionIndex === null}
              >
                <Text style={styles.actionButtonText}>Cevabı Kontrol Et</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.actionButtonText}>
                  {isLastQuestion ? 'Quizi Tamamla' : 'Sonraki Soru'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  progressContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  questionContainer: {
    padding: 16,
    maxHeight: 400,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  correctOptionText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  wrongOptionText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  optionIcon: {
    marginLeft: 8,
  },
  explanationContainer: {
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
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
  disabledButton: {
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
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  failIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.primary,
  },
  failText: {
    color: COLORS.secondary,
  },
  resultSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scorePercentage: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  buttonsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  restartButton: {
    backgroundColor: COLORS.primary,
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
  closeModalButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  previousResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  previousResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  resultDateContainer: {
    marginTop: 16,
  },
  resultDateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});