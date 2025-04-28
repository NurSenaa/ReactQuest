export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  lessonsPerWeek: number;
  daysPerWeek: number;
  totalWeeks: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserLearningPlan {
  level: 'beginner' | 'intermediate' | 'advanced';
  weeklyGoal: number;
  studyDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  streakDays: number;
  lastStudyDate: string | null;
  goalId?: string;
  startDate?: string;
  completedLessons?: string[];
  lastActivity?: string;
}

export const LEARNING_PLANS_STORAGE_KEY = 'user_learning_plan';

export const LEARNING_GOALS: LearningGoal[] = [
  {
    id: 'casual',
    title: 'Rahat Öğrenme',
    description: 'Haftada 2 gün, toplam 2 ders ile rahat bir tempoda öğrenin.',
    lessonsPerWeek: 2,
    daysPerWeek: 2,
    totalWeeks: 12,
    level: 'beginner'
  },
  {
    id: 'regular',
    title: 'Düzenli Öğrenme',
    description: 'Haftada 3 gün, toplam 3 ders ile düzenli bir şekilde öğrenin.',
    lessonsPerWeek: 3,
    daysPerWeek: 3,
    totalWeeks: 8,
    level: 'beginner'
  },
  {
    id: 'intensive',
    title: 'Yoğun Öğrenme',
    description: 'Haftada 5 gün, toplam 5 ders ile hızlı bir şekilde öğrenin.',
    lessonsPerWeek: 5,
    daysPerWeek: 5,
    totalWeeks: 5,
    level: 'intermediate'
  },
  {
    id: 'expert',
    title: 'Uzman Öğrenme',
    description: 'Haftada 6 gün, toplam 8 ders ile profesyonel seviyeye ulaşın.',
    lessonsPerWeek: 8,
    daysPerWeek: 6,
    totalWeeks: 4,
    level: 'advanced'
  }
];

export const LEVEL_DESCRIPTIONS = {
  beginner: {
    title: 'Başlangıç Seviyesi',
    description: 'React Native\'e yeni başlıyorsanız veya temel kavramları pekiştirmek istiyorsanız bu seviye sizin için idealdir. Komponentler, state yönetimi ve temel UI kavramlarını öğreneceksiniz.',
    recommendedLessons: ['1', '2', '4', '5']
  },
  intermediate: {
    title: 'Orta Seviye',
    description: 'React Native\'in temellerini biliyorsanız, bu seviye ile bilgilerinizi derinleştirebilirsiniz. Hooks, navigasyon ve veri yönetimi konularında ilerleme kaydedeceksiniz.',
    recommendedLessons: ['3', '6', '7']
  },
  advanced: {
    title: 'İleri Seviye',
    description: 'React Native\'de deneyimli geliştiriciler için. Performans optimizasyonu, karmaşık state yönetimi ve native modüller gibi ileri konuları keşfedeceksiniz.',
    recommendedLessons: ['8']
  }
};

export function getRecommendedLessons(level: 'beginner' | 'intermediate' | 'advanced') {
  return LEVEL_DESCRIPTIONS[level].recommendedLessons;
}

export function calculateNextLessons(plan: UserLearningPlan, allLessons: string[]) {
  if (!plan) return [];
  
  // Filter out completed lessons
  const completedLessons = plan.completedLessons || [];
  const remainingLessons = allLessons.filter(
    lessonId => !completedLessons.includes(lessonId)
  );
  
  // Get recommended lessons for the user's level
  const recommendedLessonIds = getRecommendedLessons(plan.level);
  
  // Prioritize recommended lessons that haven't been completed yet
  const prioritizedLessons = remainingLessons.sort((a, b) => {
    const aIsRecommended = recommendedLessonIds.includes(a);
    const bIsRecommended = recommendedLessonIds.includes(b);
    
    if (aIsRecommended && !bIsRecommended) return -1;
    if (!aIsRecommended && bIsRecommended) return 1;
    return 0;
  });
  
  // Return the next lessons to complete based on the plan's lessonsPerWeek
  const goal = plan.goalId ? LEARNING_GOALS.find(g => g.id === plan.goalId) : null;
  const lessonsPerWeek = goal ? goal.lessonsPerWeek : plan.weeklyGoal || 3;
  
  return prioritizedLessons.slice(0, lessonsPerWeek);
}

export function getDayName(dayIndex: number): string {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  return days[dayIndex];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function getWeekDates(startDate: Date, selectedDays: number[]): Date[] {
  if (!selectedDays || selectedDays.length === 0) {
    return [];
  }
  
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  // Find the next occurrence of each selected day
  for (let i = 0; i < 7; i++) {
    const dayOfWeek = (currentDate.getDay() + i) % 7;
    if (selectedDays.includes(dayOfWeek)) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
  }
  
  return dates;
}

export function updateStreak(plan: UserLearningPlan): UserLearningPlan {
  if (!plan) return plan;
  
  if (!plan.lastActivity) {
    return {
      ...plan,
      lastActivity: new Date().toISOString(),
      streakDays: 1
    };
  }
  
  const lastActivity = new Date(plan.lastActivity);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if last activity was today
  if (isToday(lastActivity)) {
    return plan; // No change needed
  }
  
  // Check if last activity was yesterday
  const wasYesterday = 
    lastActivity.getDate() === yesterday.getDate() &&
    lastActivity.getMonth() === yesterday.getMonth() &&
    lastActivity.getFullYear() === yesterday.getFullYear();
  
  if (wasYesterday) {
    // Continue streak
    return {
      ...plan,
      lastActivity: today.toISOString(),
      streakDays: plan.streakDays + 1
    };
  } else {
    // Reset streak
    return {
      ...plan,
      lastActivity: today.toISOString(),
      streakDays: 1
    };
  }
}