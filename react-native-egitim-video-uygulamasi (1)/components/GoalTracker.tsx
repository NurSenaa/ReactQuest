import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  milestones: Milestone[];
  completed: boolean;
  createdAt: string; // ISO string
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

const GOALS_STORAGE_KEY = 'user_goals';

interface GoalTrackerProps {
  onGoalComplete?: () => void;
}

export default function GoalTracker({ onGoalComplete }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newMilestones, setNewMilestones] = useState<string[]>(['']);
  const [editMode, setEditMode] = useState(false);
  
  // Load goals from AsyncStorage
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };
  
  // Save goals to AsyncStorage
  const saveGoals = async (updatedGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  };
  
  // Add a new goal
  const addGoal = () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Hata', 'Lütfen bir hedef başlığı girin.');
      return;
    }
    
    if (!newGoalDeadline.trim()) {
      Alert.alert('Hata', 'Lütfen bir bitiş tarihi girin.');
      return;
    }
    
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(newGoalDeadline)) {
      Alert.alert('Hata', 'Lütfen tarihi GG/AA/YYYY formatında girin.');
      return;
    }
    
    // Convert date to ISO string
    const [day, month, year] = newGoalDeadline.split('/').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    
    // Filter out empty milestones
    const validMilestones = newMilestones.filter(m => m.trim() !== '');
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      deadline: deadlineDate.toISOString(),
      milestones: validMilestones.map(title => ({
        id: Date.now() + Math.random().toString(),
        title,
        completed: false
      })),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (editMode && selectedGoal) {
      // Update existing goal
      const updatedGoals = goals.map(goal => 
        goal.id === selectedGoal.id ? { ...newGoal, id: selectedGoal.id } : goal
      );
      saveGoals(updatedGoals);
    } else {
      // Add new goal
      const updatedGoals = [...goals, newGoal];
      saveGoals(updatedGoals);
    }
    
    // Reset form
    resetForm();
    setShowAddModal(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Delete a goal
  const deleteGoal = (goalId: string) => {
    Alert.alert(
      'Hedefi Sil',
      'Bu hedefi silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          onPress: () => {
            const updatedGoals = goals.filter(goal => goal.id !== goalId);
            saveGoals(updatedGoals);
            setShowDetailModal(false);
            
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  // Toggle milestone completion
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed: !milestone.completed };
          }
          return milestone;
        });
        
        // Check if all milestones are completed
        const allCompleted = updatedMilestones.every(m => m.completed);
        
        return { 
          ...goal, 
          milestones: updatedMilestones,
          completed: allCompleted
        };
      }
      return goal;
    });
    
    saveGoals(updatedGoals);
    
    // If the goal is now completed, call the callback
    const updatedGoal = updatedGoals.find(g => g.id === goalId);
    if (updatedGoal?.completed && onGoalComplete) {
      onGoalComplete();
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Open goal detail modal
  const openGoalDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowDetailModal(true);
  };
  
  // Open edit goal modal
  const openEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewGoalTitle(goal.title);
    setNewGoalDescription(goal.description);
    
    // Format date as DD/MM/YYYY
    const date = new Date(goal.deadline);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    setNewGoalDeadline(`${day}/${month}/${year}`);
    
    // Set milestones
    setNewMilestones(goal.milestones.map(m => m.title));
    
    setEditMode(true);
    setShowAddModal(true);
    setShowDetailModal(false);
  };
  
  // Add a new milestone input field
  const addMilestoneField = () => {
    setNewMilestones([...newMilestones, '']);
  };
  
  // Update milestone text
  const updateMilestone = (text: string, index: number) => {
    const updatedMilestones = [...newMilestones];
    updatedMilestones[index] = text;
    setNewMilestones(updatedMilestones);
  };
  
  // Remove a milestone input field
  const removeMilestoneField = (index: number) => {
    if (newMilestones.length > 1) {
      const updatedMilestones = [...newMilestones];
      updatedMilestones.splice(index, 1);
      setNewMilestones(updatedMilestones);
    }
  };
  
  // Reset form fields
  const resetForm = () => {
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalDeadline('');
    setNewMilestones(['']);
    setEditMode(false);
    setSelectedGoal(null);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    
    // Reset time to compare just the dates
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Calculate progress percentage
  const calculateProgress = (goal: Goal) => {
    if (goal.milestones.length === 0) return 0;
    const completedCount = goal.milestones.filter(m => m.completed).length;
    return Math.round((completedCount / goal.milestones.length) * 100);
  };
  
  // Sort goals by deadline
  const sortedGoals = [...goals].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Target size={20} color={COLORS.primary} />
          <Text style={styles.title}>Uzun Vadeli Hedefler</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {goals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Henüz bir hedef eklemediniz. Yeni bir hedef eklemek için "+" butonuna tıklayın.
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.goalsList}
          showsVerticalScrollIndicator={false}
        >
          {sortedGoals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                goal.completed && styles.completedGoalCard
              ]}
              onPress={() => openGoalDetail(goal)}
              activeOpacity={0.7}
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  {goal.completed ? (
                    <CheckCircle size={20} color={COLORS.primary} />
                  ) : (
                    <Circle size={20} color={COLORS.primary} />
                  )}
                  <Text style={[
                    styles.goalTitle,
                    goal.completed && styles.completedGoalTitle
                  ]}>
                    {goal.title}
                  </Text>
                </View>
                
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
              
              <View style={styles.goalProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${calculateProgress(goal)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {calculateProgress(goal)}% tamamlandı
                </Text>
              </View>
              
              <View style={styles.goalFooter}>
                <View style={styles.deadlineContainer}>
                  <Calendar size={16} color={COLORS.textSecondary} />
                  <Text style={styles.deadlineText}>
                    {formatDate(goal.deadline)}
                  </Text>
                </View>
                
                {!goal.completed && (
                  <View style={[
                    styles.remainingContainer,
                    getDaysRemaining(goal.deadline) < 0 && styles.overdueBadge,
                    getDaysRemaining(goal.deadline) <= 7 && getDaysRemaining(goal.deadline) >= 0 && styles.urgentBadge
                  ]}>
                    <Clock size={14} color={
                      getDaysRemaining(goal.deadline) < 0 ? '#F44336' :
                      getDaysRemaining(goal.deadline) <= 7 ? '#FF9800' :
                      COLORS.textSecondary
                    } />
                    <Text style={[
                      styles.remainingText,
                      getDaysRemaining(goal.deadline) < 0 && styles.overdueText,
                      getDaysRemaining(goal.deadline) <= 7 && getDaysRemaining(goal.deadline) >= 0 && styles.urgentText
                    ]}>
                      {getDaysRemaining(goal.deadline) < 0 
                        ? `${Math.abs(getDaysRemaining(goal.deadline))} gün gecikti` 
                        : getDaysRemaining(goal.deadline) === 0
                          ? 'Bugün son gün'
                          : `${getDaysRemaining(goal.deadline)} gün kaldı`}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      {/* Add/Edit Goal Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Hedefi Düzenle' : 'Yeni Hedef Ekle'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Hedef Başlığı</Text>
              <TextInput
                style={styles.input}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
                placeholder="Örn: React Native ile bir uygulama geliştir"
                placeholderTextColor={COLORS.textSecondary}
              />
              
              <Text style={styles.inputLabel}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGoalDescription}
                onChangeText={setNewGoalDescription}
                placeholder="Hedefin detaylarını yazın..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <Text style={styles.inputLabel}>Bitiş Tarihi (GG/AA/YYYY)</Text>
              <TextInput
                style={styles.input}
                value={newGoalDeadline}
                onChangeText={setNewGoalDeadline}
                placeholder="30/06/2023"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numbers-and-punctuation"
              />
              
              <Text style={styles.inputLabel}>Kilometre Taşları</Text>
              {newMilestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneInputContainer}>
                  <TextInput
                    style={[styles.input, styles.milestoneInput]}
                    value={milestone}
                    onChangeText={(text) => updateMilestone(text, index)}
                    placeholder={`Kilometre Taşı ${index + 1}`}
                    placeholderTextColor={COLORS.textSecondary}
                  />
                  
                  <TouchableOpacity 
                    style={styles.removeMilestoneButton}
                    onPress={() => removeMilestoneField(index)}
                    disabled={newMilestones.length === 1}
                  >
                    <X size={20} color={newMilestones.length === 1 ? COLORS.border : COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.addMilestoneButton}
                onPress={addMilestoneField}
              >
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addMilestoneButtonText}>
                  Kilometre Taşı Ekle
                </Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addGoal}
              >
                <Text style={styles.saveButtonText}>
                  {editMode ? 'Güncelle' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Goal Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        {selectedGoal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Hedef Detayı</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowDetailModal(false)}
                >
                  <X size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.goalDetailHeader}>
                  <Text style={styles.goalDetailTitle}>{selectedGoal.title}</Text>
                  
                  <View style={styles.goalDetailActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => openEditGoal(selectedGoal)}
                    >
                      <Edit2 size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteGoal(selectedGoal.id)}
                    >
                      <Trash2 size={18} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {selectedGoal.description && (
                  <Text style={styles.goalDetailDescription}>
                    {selectedGoal.description}
                  </Text>
                )}
                
                <View style={styles.goalDetailInfo}>
                  <View style={styles.goalDetailInfoItem}>
                    <Calendar size={18} color={COLORS.primary} />
                    <Text style={styles.goalDetailInfoText}>
                      Bitiş Tarihi: {formatDate(selectedGoal.deadline)}
                    </Text>
                  </View>
                  
                  {!selectedGoal.completed && (
                    <View style={styles.goalDetailInfoItem}>
                      <Clock size={18} color={
                        getDaysRemaining(selectedGoal.deadline) < 0 ? '#F44336' :
                        getDaysRemaining(selectedGoal.deadline) <= 7 ? '#FF9800' :
                        COLORS.primary
                      } />
                      <Text style={[
                        styles.goalDetailInfoText,
                        getDaysRemaining(selectedGoal.deadline) < 0 && { color: '#F44336' },
                        getDaysRemaining(selectedGoal.deadline) <= 7 && getDaysRemaining(selectedGoal.deadline) >= 0 && { color: '#FF9800' }
                      ]}>
                        {getDaysRemaining(selectedGoal.deadline) < 0 
                          ? `${Math.abs(getDaysRemaining(selectedGoal.deadline))} gün gecikti` 
                          : getDaysRemaining(selectedGoal.deadline) === 0
                            ? 'Bugün son gün'
                            : `${getDaysRemaining(selectedGoal.deadline)} gün kaldı`}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.goalDetailProgress}>
                  <View style={styles.goalDetailProgressHeader}>
                    <Text style={styles.goalDetailProgressTitle}>İlerleme</Text>
                    <Text style={styles.goalDetailProgressPercentage}>
                      {calculateProgress(selectedGoal)}%
                    </Text>
                  </View>
                  
                  <View style={styles.goalDetailProgressBar}>
                    <View 
                      style={[
                        styles.goalDetailProgressFill, 
                        { width: `${calculateProgress(selectedGoal)}%` }
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={styles.milestonesTitle}>Kilometre Taşları</Text>
                
                {selectedGoal.milestones.length > 0 ? (
                  selectedGoal.milestones.map(milestone => (
                    <TouchableOpacity
                      key={milestone.id}
                      style={styles.milestoneItem}
                      onPress={() => toggleMilestone(selectedGoal.id, milestone.id)}
                    >
                      {milestone.completed ? (
                        <CheckCircle size={20} color={COLORS.primary} />
                      ) : (
                        <Circle size={20} color={COLORS.textSecondary} />
                      )}
                      <Text style={[
                        styles.milestoneText,
                        milestone.completed && styles.completedMilestoneText
                      ]}>
                        {milestone.title}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noMilestonesText}>
                    Bu hedef için kilometre taşı eklenmemiş.
                  </Text>
                )}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.closeModalButton}
                  onPress={() => setShowDetailModal(false)}
                >
                  <Text style={styles.closeModalButtonText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  goalsList: {
    maxHeight: 400,
  },
  goalCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  completedGoalCard: {
    backgroundColor: COLORS.primaryLight + '40',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  completedGoalTitle: {
    color: COLORS.primary,
    textDecorationLine: 'line-through',
  },
  goalProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadge: {
    backgroundColor: '#FFEBEE',
  },
  urgentBadge: {
    backgroundColor: '#FFF3E0',
  },
  remainingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  overdueText: {
    color: '#F44336',
  },
  urgentText: {
    color: '#FF9800',
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
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
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
  modalContent: {
    padding: 16,
    maxHeight: 500,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
  },
  milestoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneInput: {
    flex: 1,
    marginBottom: 8,
  },
  removeMilestoneButton: {
    padding: 8,
    marginLeft: 8,
  },
  addMilestoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  addMilestoneButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
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
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  goalDetailHeader: {
    marginBottom: 16,
  },
  goalDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  goalDetailActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  goalDetailDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  goalDetailInfo: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  goalDetailInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalDetailInfoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  goalDetailProgress: {
    marginBottom: 16,
  },
  goalDetailProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalDetailProgressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  goalDetailProgressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  goalDetailProgressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalDetailProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  milestonesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  milestoneText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  completedMilestoneText: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  noMilestonesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
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
  closeModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});