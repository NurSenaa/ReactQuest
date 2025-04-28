import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { 
  Home, 
  BookOpen, 
  Target, 
  Award, 
  Code, 
  BarChart2 
} from 'lucide-react-native';

import { COLORS } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.cardBackground,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ReactQuest',
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Dersler',
          tabBarLabel: 'Öğren',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Öğrenme Planı',
          tabBarLabel: 'Plan',
          tabBarIcon: ({ color }) => <Target size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projeler',
          tabBarLabel: 'Projeler',
          tabBarIcon: ({ color }) => <Code size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Başarılar',
          tabBarLabel: 'Başarılar',
          tabBarIcon: ({ color }) => <Award size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'İstatistikler',
          tabBarLabel: 'İstatistik',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}