import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Bell, Clock, Calendar, Award, Flame } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface NotificationSettingsProps {
  onClose: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const [dailyReminders, setDailyReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  const toggleSwitch = (setting: string, value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch (setting) {
      case 'daily':
        setDailyReminders(value);
        break;
      case 'streak':
        setStreakAlerts(value);
        break;
      case 'achievement':
        setAchievementNotifications(value);
        break;
      case 'weekly':
        setWeeklyDigest(value);
        break;
    }
  };
  
  const saveSettings = () => {
    // In a real app, this would save to AsyncStorage and configure actual notifications
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show a simulated success message
    alert('Bildirim ayarlarınız kaydedildi!');
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bildirim Ayarları</Text>
        <Text style={styles.subtitle}>
          Öğrenme deneyiminizi kişiselleştirin
        </Text>
      </View>
      
      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8EDFF' }]}>
              <Bell size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Günlük Hatırlatıcılar</Text>
              <Text style={styles.settingDescription}>
                Günlük öğrenme hedefleriniz için hatırlatmalar alın
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#E1E1E8', true: '#4A6FFF50' }}
            thumbColor={dailyReminders ? COLORS.primary : '#f4f3f4'}
            ios_backgroundColor="#E1E1E8"
            onValueChange={(value) => toggleSwitch('daily', value)}
            value={dailyReminders}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Flame size={20} color="#FF9500" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Seri Uyarıları</Text>
              <Text style={styles.settingDescription}>
                Serinizi korumak için hatırlatmalar alın
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#E1E1E8', true: '#FF950050' }}
            thumbColor={streakAlerts ? '#FF9500' : '#f4f3f4'}
            ios_backgroundColor="#E1E1E8"
            onValueChange={(value) => toggleSwitch('streak', value)}
            value={streakAlerts}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFE8EC' }]}>
              <Award size={20} color="#FF6B6B" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Başarı Bildirimleri</Text>
              <Text style={styles.settingDescription}>
                Yeni başarılar kazandığınızda bildirim alın
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#E1E1E8', true: '#FF6B6B50' }}
            thumbColor={achievementNotifications ? '#FF6B6B' : '#f4f3f4'}
            ios_backgroundColor="#E1E1E8"
            onValueChange={(value) => toggleSwitch('achievement', value)}
            value={achievementNotifications}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconContainer, { backgroundColor: '#E6F7FF' }]}>
              <Calendar size={20} color="#0099FF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Haftalık Özet</Text>
              <Text style={styles.settingDescription}>
                Haftalık ilerleme özetinizi alın
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#E1E1E8', true: '#0099FF50' }}
            thumbColor={weeklyDigest ? '#0099FF' : '#f4f3f4'}
            ios_backgroundColor="#E1E1E8"
            onValueChange={(value) => toggleSwitch('weekly', value)}
            value={weeklyDigest}
          />
        </View>
      </View>
      
      <View style={styles.reminderTimeContainer}>
        <Text style={styles.reminderTimeTitle}>Günlük Hatırlatma Saati</Text>
        <TouchableOpacity style={styles.timeSelector}>
          <Clock size={20} color={COLORS.primary} />
          <Text style={styles.timeText}>19:00</Text>
        </TouchableOpacity>
        <Text style={styles.reminderTimeDescription}>
          Günlük hatırlatmalar için tercih ettiğiniz saat
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveSettings}
        >
          <Text style={styles.saveButtonText}>Ayarları Kaydet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={onClose}
        >
          <Text style={styles.cancelButtonText}>İptal</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.disclaimer}>
        Not: Bu bildirim ayarları simülasyondur. Gerçek bildirimler için uygulama izinlerini etkinleştirmeniz gerekir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    maxWidth: 500,
    width: '100%',
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingsContainer: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  reminderTimeContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  reminderTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  reminderTimeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
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
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});