import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Award, Flame, BookOpen, GraduationCap, Brain, CheckCircle, Trophy, Star } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { Achievement, UserAchievement } from '@/constants/achievements';

interface AchievementCardProps {
  achievement: Achievement;
  earned?: boolean;
  earnedDate?: string;
  onPress?: () => void;
}

export default function AchievementCard({ 
  achievement, 
  earned = false,
  earnedDate,
  onPress
}: AchievementCardProps) {
  // Get the appropriate icon component
  const getIconComponent = () => {
    switch (achievement.icon) {
      case 'Flame':
        return <Flame size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'BookOpen':
        return <BookOpen size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'GraduationCap':
        return <GraduationCap size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'Brain':
        return <Brain size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'Award':
        return <Award size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'CheckCircle':
        return <CheckCircle size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'Trophy':
        return <Trophy size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      case 'Star':
        return <Star size={24} color={earned ? achievement.color : '#CCCCCC'} />;
      default:
        return <Award size={24} color={earned ? achievement.color : '#CCCCCC'} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        earned ? styles.earnedContainer : styles.lockedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={[
        styles.iconContainer,
        earned ? { backgroundColor: `${achievement.color}20` } : styles.lockedIconContainer
      ]}>
        {getIconComponent()}
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          earned ? { color: achievement.color } : styles.lockedTitle
        ]}>
          {achievement.title}
        </Text>
        
        <Text style={styles.description}>
          {achievement.description}
        </Text>
        
        {earned && earnedDate && (
          <Text style={styles.earnedDate}>
            Kazanıldı: {formatDate(earnedDate)}
          </Text>
        )}
      </View>
      
      {!earned && (
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedText}>Kilitli</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
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
  earnedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  lockedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lockedIconContainer: {
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lockedTitle: {
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  earnedDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  lockedBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lockedText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});