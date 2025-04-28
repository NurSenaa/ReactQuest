import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Platform 
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { LEARNING_GOALS, LearningGoal } from '@/constants/learning-plans';
import { Calendar, Clock, BookOpen } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface WeeklyGoalSelectorProps {
  onSelectGoal: (goalId: string) => void;
  initialGoalId?: string;
}

export default function WeeklyGoalSelector({ 
  onSelectGoal,
  initialGoalId = 'regular'
}: WeeklyGoalSelectorProps) {
  const [selectedGoalId, setSelectedGoalId] = useState(initialGoalId);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    onSelectGoal(goalId);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const selectedGoal = LEARNING_GOALS.find(goal => goal.id === selectedGoalId) || LEARNING_GOALS[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haftalık Hedef Belirleyin</Text>
      <Text style={styles.subtitle}>
        Öğrenme hızınıza ve programınıza uygun bir hedef seçin
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.goalsContainer}
      >
        {LEARNING_GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoalId === goal.id && styles.selectedGoalCard
            ]}
            onPress={() => handleGoalSelect(goal.id)}
          >
            <Text style={[
              styles.goalTitle,
              selectedGoalId === goal.id && styles.selectedGoalTitle
            ]}>
              {goal.title}
            </Text>
            
            <View style={styles.goalMetrics}>
              <View style={styles.goalMetric}>
                <Calendar size={16} color={selectedGoalId === goal.id ? COLORS.primary : COLORS.textSecondary} />
                <Text style={[
                  styles.goalMetricText,
                  selectedGoalId === goal.id && styles.selectedGoalMetricText
                ]}>
                  {goal.daysPerWeek} gün/hafta
                </Text>
              </View>
              
              <View style={styles.goalMetric}>
                <BookOpen size={16} color={selectedGoalId === goal.id ? COLORS.primary : COLORS.textSecondary} />
                <Text style={[
                  styles.goalMetricText,
                  selectedGoalId === goal.id && styles.selectedGoalMetricText
                ]}>
                  {goal.lessonsPerWeek} ders/hafta
                </Text>
              </View>
              
              <View style={styles.goalMetric}>
                <Clock size={16} color={selectedGoalId === goal.id ? COLORS.primary : COLORS.textSecondary} />
                <Text style={[
                  styles.goalMetricText,
                  selectedGoalId === goal.id && styles.selectedGoalMetricText
                ]}>
                  {goal.totalWeeks} hafta
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.selectedGoalInfo}>
        <Text style={styles.selectedGoalInfoTitle}>{selectedGoal.title}</Text>
        <Text style={styles.selectedGoalInfoDescription}>{selectedGoal.description}</Text>
        
        <View style={styles.timeEstimation}>
          <Clock size={18} color={COLORS.primary} />
          <Text style={styles.timeEstimationText}>
            Tahmini tamamlanma süresi: {selectedGoal.totalWeeks} hafta
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  goalsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  goalCard: {
    width: 180,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  selectedGoalCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  selectedGoalTitle: {
    color: COLORS.primary,
  },
  goalMetrics: {
    gap: 8,
  },
  goalMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalMetricText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedGoalMetricText: {
    color: COLORS.text,
  },
  selectedGoalInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  selectedGoalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  selectedGoalInfoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  timeEstimation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  timeEstimationText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
});