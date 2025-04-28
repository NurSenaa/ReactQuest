import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { getDayName } from '@/constants/learning-plans';
import { CheckCircle, Circle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface DaySelectorProps {
  onSelectDays: (days: number[]) => void;
  requiredDays: number;
  initialSelectedDays?: number[];
}

export default function DaySelector({ 
  onSelectDays,
  requiredDays,
  initialSelectedDays = []
}: DaySelectorProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>(initialSelectedDays);

  const toggleDay = (dayIndex: number) => {
    let updatedDays: number[];
    
    if (selectedDays.includes(dayIndex)) {
      // Remove day if already selected
      updatedDays = selectedDays.filter(day => day !== dayIndex);
    } else {
      // Add day if not at limit
      if (selectedDays.length < requiredDays) {
        updatedDays = [...selectedDays, dayIndex];
        
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        // At limit, show feedback
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return;
      }
    }
    
    setSelectedDays(updatedDays);
    onSelectDays(updatedDays);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Çalışma Günlerinizi Seçin</Text>
      <Text style={styles.subtitle}>
        Haftada {requiredDays} gün seçmeniz gerekiyor
      </Text>
      
      <View style={styles.daysContainer}>
        {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
          <TouchableOpacity
            key={dayIndex}
            style={[
              styles.dayButton,
              selectedDays.includes(dayIndex) && styles.selectedDayButton
            ]}
            onPress={() => toggleDay(dayIndex)}
          >
            {selectedDays.includes(dayIndex) ? (
              <CheckCircle size={20} color={COLORS.primary} />
            ) : (
              <Circle size={20} color={COLORS.textSecondary} />
            )}
            <Text style={[
              styles.dayText,
              selectedDays.includes(dayIndex) && styles.selectedDayText
            ]}>
              {getDayName(dayIndex)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionInfoText}>
          {selectedDays.length} / {requiredDays} gün seçildi
        </Text>
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
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  dayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    minWidth: '30%',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedDayText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  selectionInfo: {
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectionInfoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});