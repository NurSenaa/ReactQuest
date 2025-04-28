export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react-native
  requiredValue: number;
  type: 'streak' | 'lessons' | 'quizzes';
  color: string;
}

export interface UserAchievement {
  id: string;
  dateEarned: string;
}

export const ACHIEVEMENTS_STORAGE_KEY = 'user_achievements';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    title: '3 Gün Seri',
    description: '3 gün üst üste öğrenme',
    icon: 'Flame',
    requiredValue: 3,
    type: 'streak',
    color: '#FF9500'
  },
  {
    id: 'streak_7',
    title: 'Haftalık Seri',
    description: '7 gün üst üste öğrenme',
    icon: 'Flame',
    requiredValue: 7,
    type: 'streak',
    color: '#FF9500'
  },
  {
    id: 'streak_14',
    title: 'İki Haftalık Seri',
    description: '14 gün üst üste öğrenme',
    icon: 'Flame',
    requiredValue: 14,
    type: 'streak',
    color: '#FF9500'
  },
  {
    id: 'streak_30',
    title: 'Aylık Seri',
    description: '30 gün üst üste öğrenme',
    icon: 'Flame',
    requiredValue: 30,
    type: 'streak',
    color: '#FF9500'
  },
  
  // Lesson completion achievements
  {
    id: 'lessons_5',
    title: 'Başlangıç',
    description: '5 ders tamamla',
    icon: 'BookOpen',
    requiredValue: 5,
    type: 'lessons',
    color: '#4A6FFF'
  },
  {
    id: 'lessons_10',
    title: 'Öğrenci',
    description: '10 ders tamamla',
    icon: 'GraduationCap',
    requiredValue: 10,
    type: 'lessons',
    color: '#4A6FFF'
  },
  {
    id: 'lessons_15',
    title: 'Bilgili',
    description: '15 ders tamamla',
    icon: 'Brain',
    requiredValue: 15,
    type: 'lessons',
    color: '#4A6FFF'
  },
  {
    id: 'lessons_all',
    title: 'Uzman',
    description: 'Tüm dersleri tamamla',
    icon: 'Award',
    requiredValue: 100, // This will be checked differently
    type: 'lessons',
    color: '#4A6FFF'
  },
  
  // Quiz achievements
  {
    id: 'quiz_3',
    title: 'Quiz Ustası',
    description: '3 quiz tamamla',
    icon: 'CheckCircle',
    requiredValue: 3,
    type: 'quizzes',
    color: '#FF6B6B'
  },
  {
    id: 'quiz_5',
    title: 'Quiz Şampiyonu',
    description: '5 quiz tamamla',
    icon: 'Trophy',
    requiredValue: 5,
    type: 'quizzes',
    color: '#FF6B6B'
  },
  {
    id: 'quiz_perfect',
    title: 'Mükemmel Skor',
    description: 'Bir quizde %100 başarı elde et',
    icon: 'Star',
    requiredValue: 100,
    type: 'quizzes',
    color: '#FF6B6B'
  }
];

// Check if user has earned a new achievement
export function checkForNewAchievements(
  streakDays: number,
  completedLessons: string[],
  quizResults: any[],
  totalLessons: number,
  earnedAchievements: UserAchievement[]
): UserAchievement[] {
  const newAchievements: UserAchievement[] = [];
  const earnedIds = earnedAchievements.map(a => a.id);
  
  // Check each achievement
  ACHIEVEMENTS.forEach(achievement => {
    // Skip if already earned
    if (earnedIds.includes(achievement.id)) return;
    
    let earned = false;
    
    switch (achievement.type) {
      case 'streak':
        earned = streakDays >= achievement.requiredValue;
        break;
      case 'lessons':
        if (achievement.id === 'lessons_all') {
          earned = completedLessons.length >= totalLessons;
        } else {
          earned = completedLessons.length >= achievement.requiredValue;
        }
        break;
      case 'quizzes':
        if (achievement.id === 'quiz_perfect') {
          earned = quizResults.some(result => 
            result.score === result.totalQuestions && result.totalQuestions > 0
          );
        } else {
          earned = quizResults.length >= achievement.requiredValue;
        }
        break;
    }
    
    if (earned) {
      newAchievements.push({
        id: achievement.id,
        dateEarned: new Date().toISOString()
      });
    }
  });
  
  return newAchievements;
}