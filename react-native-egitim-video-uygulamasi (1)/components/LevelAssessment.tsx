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
import { LEVEL_DESCRIPTIONS } from '@/constants/learning-plans';
import { BookOpen, Zap, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface LevelAssessmentProps {
  onSelectLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  initialLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export default function LevelAssessment({ 
  onSelectLevel,
  initialLevel = 'beginner'
}: LevelAssessmentProps) {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(initialLevel);

  const handleLevelSelect = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(level);
    onSelectLevel(level);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return <BookOpen size={24} color={COLORS.primary} />;
      case 'intermediate':
        return <Zap size={24} color="#FF9500" />;
      case 'advanced':
        return <Award size={24} color="#FF2D55" />;
      default:
        return <BookOpen size={24} color={COLORS.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seviyenizi Seçin</Text>
      <Text style={styles.subtitle}>
        Size en uygun içeriği önerebilmemiz için seviyenizi belirleyin
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.levelsContainer}
      >
        {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelCard,
              selectedLevel === level && styles.selectedLevelCard
            ]}
            onPress={() => handleLevelSelect(level)}
          >
            <View style={styles.levelIconContainer}>
              {getLevelIcon(level)}
            </View>
            <Text style={[
              styles.levelTitle,
              selectedLevel === level && styles.selectedLevelTitle
            ]}>
              {LEVEL_DESCRIPTIONS[level].title}
            </Text>
            <Text style={styles.levelDescription}>
              {LEVEL_DESCRIPTIONS[level].description.split('.')[0]}.
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.selectedLevelInfo}>
        <Text style={styles.selectedLevelTitle}>
          {LEVEL_DESCRIPTIONS[selectedLevel].title}
        </Text>
        <Text style={styles.selectedLevelDescription}>
          {LEVEL_DESCRIPTIONS[selectedLevel].description}
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
  levelsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  levelCard: {
    width: 160,
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
  selectedLevelCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  levelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  selectedLevelTitle: {
    color: COLORS.primary,
  },
  levelDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  selectedLevelInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  selectedLevelDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 8,
  },
});