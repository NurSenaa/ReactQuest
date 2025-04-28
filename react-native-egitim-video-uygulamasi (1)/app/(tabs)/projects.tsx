import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Code, ChevronRight, CheckCircle, Circle, Star, Filter } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { PROJECTS, PROJECT_PROGRESS_KEY } from '@/constants/projects';

export default function ProjectsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load completed steps from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const storedProgress = await AsyncStorage.getItem(PROJECT_PROGRESS_KEY);
        if (storedProgress) {
          setCompletedSteps(JSON.parse(storedProgress));
        }
      } catch (error) {
        console.error('Failed to load project progress:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  // Filter projects based on selected difficulty and category
  const filteredProjects = PROJECTS.filter(project => {
    if (selectedDifficulty && project.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedCategory && project.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Get unique categories and difficulties for filters
  const categories = [...new Set(PROJECTS.map(project => project.category))];
  const difficulties = [...new Set(PROJECTS.map(project => project.difficulty))];

  // Calculate project completion percentage
  const getProjectCompletion = (projectId: string) => {
    const project = PROJECTS.find(p => p.id === projectId);
    if (!project) return 0;
    
    const totalSteps = project.steps.length;
    const completedProjectSteps = completedSteps[projectId] || [];
    
    return Math.round((completedProjectSteps.length / totalSteps) * 100);
  };

  // Navigate to project detail
  const navigateToProject = (projectId: string) => {
    router.push({
      pathname: '/project/[id]',
      params: { id: projectId }
    });
  };

  // Toggle difficulty filter
  const toggleDifficultyFilter = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
      
      // Provide haptic feedback when selecting filter
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      
      // Provide haptic feedback when selecting filter
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['right', 'left']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Projeler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Code size={24} color={COLORS.primary} style={styles.titleIcon} />
          <Text style={styles.title}>Proje Tabanlı Öğrenme</Text>
        </View>
        <Text style={styles.subtitle}>
          Gerçek dünya projeleri ile React Native becerilerinizi geliştirin
        </Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>
          <Filter size={16} color={COLORS.text} /> Filtreler
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          {difficulties.map(difficulty => (
            <TouchableOpacity
              key={`difficulty-${difficulty}`}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty && styles.selectedFilterChip,
                { borderColor: getDifficultyColor(difficulty) }
              ]}
              onPress={() => toggleDifficultyFilter(difficulty)}
            >
              <Text 
                style={[
                  styles.filterText,
                  { color: getDifficultyColor(difficulty) },
                  selectedDifficulty === difficulty && styles.selectedFilterText
                ]}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
          
          {categories.map(category => (
            <TouchableOpacity
              key={`category-${category}`}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.selectedFilterChip
              ]}
              onPress={() => toggleCategoryFilter(category)}
            >
              <Text 
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.selectedFilterText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView 
        style={styles.projectsContainer}
        contentContainerStyle={styles.projectsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Seçilen filtrelere uygun proje bulunamadı.
            </Text>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
              }}
            >
              <Text style={styles.resetFiltersText}>Filtreleri Temizle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProjects.map(project => {
            const completionPercentage = getProjectCompletion(project.id);
            const isStarted = completionPercentage > 0;
            const isCompleted = completionPercentage === 100;
            
            return (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.projectCard,
                  isCompleted && styles.completedProjectCard
                ]}
                onPress={() => navigateToProject(project.id)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: project.image }} 
                  style={styles.projectImage}
                  resizeMode="cover"
                />
                
                <View style={styles.projectContent}>
                  <View style={styles.projectHeader}>
                    <View>
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
                      </View>
                    </View>
                    
                    {isCompleted ? (
                      <CheckCircle size={24} color={COLORS.primary} />
                    ) : (
                      <ChevronRight size={24} color={COLORS.primary} />
                    )}
                  </View>
                  
                  <Text 
                    style={styles.projectDescription}
                    numberOfLines={2}
                  >
                    {project.description}
                  </Text>
                  
                  <View style={styles.projectFooter}>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${completionPercentage}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {completionPercentage}% Tamamlandı
                      </Text>
                    </View>
                    
                    <View style={styles.stepsInfo}>
                      <Text style={styles.stepsText}>
                        {project.steps.length} Adım
                      </Text>
                      {project.estimatedHours && (
                        <Text style={styles.hoursText}>
                          ~{project.estimatedHours} saat
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersScrollContent: {
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  selectedFilterText: {
    color: COLORS.white,
  },
  projectsContainer: {
    flex: 1,
  },
  projectsContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetFiltersText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  projectCard: {
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
  completedProjectCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  projectImage: {
    width: '100%',
    height: 160,
  },
  projectContent: {
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  projectDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
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
  stepsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  hoursText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});