import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Switch, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { Bell, Clock, Calendar, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Conditionally import DateTimePicker
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  try {
    // Only import on native platforms
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch (error) {
    console.log('DateTimePicker not available:', error);
  }
}

// Conditionally import expo-notifications
let Notifications: any = null;
if (Platform.OS !== 'web') {
  try {
    // Only import on native platforms
    Notifications = require('expo-notifications');
  } catch (error) {
    console.log('expo-notifications not available:', error);
  }
}

interface ReminderSettings {
  enabled: boolean;
  time: string; // Format: "HH:MM"
  days: number[]; // 0 = Sunday, 1 = Monday, etc.
  motivationalMessages: boolean;
}

const REMINDER_SETTINGS_KEY = 'reminder_settings';
const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  time: '09:00',
  days: [1, 2, 3, 4, 5], // Monday to Friday
  motivationalMessages: true,
};

const DAYS_OF_WEEK = [
  { id: 0, name: 'Pzr' },
  { id: 1, name: 'Pzt' },
  { id: 2, name: 'Sal' },
  { id: 3, name: 'Çar' },
  { id: 4, name: 'Per' },
  { id: 5, name: 'Cum' },
  { id: 6, name: 'Cmt' },
];

const MOTIVATIONAL_MESSAGES = [
  "Bugün yeni bir şey öğrenmeye hazır mısın?",
  "Öğrenme yolculuğunda bir adım daha atmaya ne dersin?",
  "Günlük React Native hedefini unutma!",
  "Bugün kodlama zamanı! 🚀",
  "Düzenli çalışma, başarının anahtarıdır.",
  "Bugün öğreneceğin şey, yarın yapacağın projelerin temeli olacak.",
  "Küçük adımlar, büyük sonuçlar doğurur.",
  "Bugün 15 dakika bile ayırsan, ilerleme kaydetmiş olursun.",
  "Öğrenme serini devam ettir!",
  "Bugün kendini geliştirmek için mükemmel bir gün!"
];

export default function ReminderSettings() {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
    if (Platform.OS !== 'web' && Notifications) {
      checkNotificationPermissions();
    }
  }, []);
  
  // Check notification permissions
  const checkNotificationPermissions = async () => {
    if (Platform.OS === 'web' || !Notifications) {
      setHasPermission(false);
      return;
    }
    
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setHasPermission(false);
    }
  };
  
  // Request notification permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'web' || !Notifications) {
      Alert.alert('Bilgi', 'Web platformunda bildirimler desteklenmemektedir.');
      return false;
    }
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };
  
  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load reminder settings:', error);
    }
  };
  
  // Save settings to AsyncStorage
  const saveSettings = async (newSettings: ReminderSettings) => {
    try {
      await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Schedule or cancel notifications based on settings
      if (newSettings.enabled && Platform.OS !== 'web' && Notifications) {
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) {
            Alert.alert(
              'Bildirim İzni Gerekli',
              'Hatırlatıcıları kullanabilmek için bildirim izni vermeniz gerekmektedir.',
              [{ text: 'Tamam' }]
            );
            return;
          }
        }
        await scheduleNotifications(newSettings);
      } else if (Platform.OS !== 'web' && Notifications) {
        await cancelAllNotifications();
      }
      
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to save reminder settings:', error);
    }
  };
  
  // Toggle reminder enabled/disabled
  const toggleReminder = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    saveSettings(newSettings);
  };
  
  // Toggle day selection
  const toggleDay = (dayId: number) => {
    const newDays = [...settings.days];
    const index = newDays.indexOf(dayId);
    
    if (index !== -1) {
      // Remove day if already selected
      newDays.splice(index, 1);
    } else {
      // Add day if not selected
      newDays.push(dayId);
    }
    
    const newSettings = { ...settings, days: newDays };
    saveSettings(newSettings);
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Toggle motivational messages
  const toggleMotivationalMessages = () => {
    const newSettings = { 
      ...settings, 
      motivationalMessages: !settings.motivationalMessages 
    };
    saveSettings(newSettings);
  };
  
  // Handle time change
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      const newSettings = { ...settings, time: timeString };
      saveSettings(newSettings);
    }
  };
  
  // Schedule notifications based on settings
  const scheduleNotifications = async (reminderSettings: ReminderSettings) => {
    if (Platform.OS === 'web' || !Notifications) return;
    
    try {
      // Cancel existing notifications first
      await cancelAllNotifications();
      
      // Parse time
      const [hours, minutes] = reminderSettings.time.split(':').map(Number);
      
      // Schedule notifications for each selected day
      for (const dayOfWeek of reminderSettings.days) {
        const identifier = `reminder-${dayOfWeek}`;
        
        // Get message
        let message = "Günlük React Native öğrenme zamanı!";
        if (reminderSettings.motivationalMessages) {
          const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
          message = MOTIVATIONAL_MESSAGES[randomIndex];
        }
        
        // Schedule notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'ReactQuest Öğrenme Hatırlatıcısı',
            body: message,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            weekday: dayOfWeek + 1, // Notification API uses 1-7 for days
            hour: hours,
            minute: minutes,
            repeats: true,
          },
          identifier,
        });
      }
      
      console.log('Notifications scheduled successfully');
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
    }
  };
  
  // Cancel all scheduled notifications
  const cancelAllNotifications = async () => {
    if (Platform.OS === 'web' || !Notifications) return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  // Show time picker
  const showTimePickerModal = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Bilgi', 'Web platformunda zaman seçici desteklenmemektedir.');
      return;
    }
    
    setShowTimePicker(true);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bell size={24} color={COLORS.primary} />
        <Text style={styles.title}>Öğrenme Hatırlatıcıları</Text>
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Hatırlatıcıları Etkinleştir</Text>
        <Switch
          value={settings.enabled}
          onValueChange={toggleReminder}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={settings.enabled ? COLORS.primary : COLORS.cardBackground}
        />
      </View>
      
      <View style={[styles.settingsSection, !settings.enabled && styles.disabledSection]}>
        <TouchableOpacity 
          style={styles.timeSelector}
          onPress={showTimePickerModal}
          disabled={!settings.enabled}
        >
          <View style={styles.timeSelectorHeader}>
            <Clock size={20} color={settings.enabled ? COLORS.primary : COLORS.textSecondary} />
            <Text 
              style={[
                styles.timeSelectorLabel,
                !settings.enabled && styles.disabledText
              ]}
            >
              Hatırlatıcı Zamanı
            </Text>
          </View>
          <Text 
            style={[
              styles.timeValue,
              !settings.enabled && styles.disabledText
            ]}
          >
            {formatTime(settings.time)}
          </Text>
        </TouchableOpacity>
        
        {showTimePicker && Platform.OS !== 'web' && DateTimePicker && (
          <DateTimePicker
            value={(() => {
              const [hours, minutes] = settings.time.split(':').map(Number);
              const date = new Date();
              date.setHours(hours, minutes, 0);
              return date;
            })()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        
        <View style={styles.daysSelector}>
          <View style={styles.daysSelectorHeader}>
            <Calendar size={20} color={settings.enabled ? COLORS.primary : COLORS.textSecondary} />
            <Text 
              style={[
                styles.daysSelectorLabel,
                !settings.enabled && styles.disabledText
              ]}
            >
              Hatırlatıcı Günleri
            </Text>
          </View>
          
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  settings.days.includes(day.id) && styles.selectedDayButton,
                  !settings.enabled && styles.disabledDayButton
                ]}
                onPress={() => toggleDay(day.id)}
                disabled={!settings.enabled}
              >
                <Text 
                  style={[
                    styles.dayButtonText,
                    settings.days.includes(day.id) && styles.selectedDayButtonText,
                    !settings.enabled && styles.disabledText
                  ]}
                >
                  {day.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.switchContainer}>
          <Text 
            style={[
              styles.switchLabel,
              !settings.enabled && styles.disabledText
            ]}
          >
            Motivasyon Mesajları
          </Text>
          <Switch
            value={settings.motivationalMessages}
            onValueChange={toggleMotivationalMessages}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={settings.motivationalMessages ? COLORS.primary : COLORS.cardBackground}
            disabled={!settings.enabled}
          />
        </View>
      </View>
      
      {Platform.OS !== 'web' && Notifications && !hasPermission && (
        <View style={styles.permissionWarning}>
          <AlertCircle size={20} color="#F44336" style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Hatırlatıcıları kullanabilmek için bildirim izni vermeniz gerekmektedir.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermissions}
          >
            <Text style={styles.permissionButtonText}>İzin Ver</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Hatırlatıcılar Hakkında</Text>
        <Text style={styles.infoText}>
          Düzenli öğrenme alışkanlığı geliştirmek için hatırlatıcıları kullanabilirsiniz. 
          Seçtiğiniz günlerde ve saatte size bildirim gönderilecektir.
        </Text>
        <Text style={styles.infoText}>
          Motivasyon mesajlarını etkinleştirerek her gün farklı bir motivasyon mesajı alabilirsiniz.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingsSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  disabledSection: {
    opacity: 0.7,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  timeSelector: {
    marginBottom: 16,
  },
  timeSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeSelectorLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  daysSelector: {
    marginBottom: 16,
  },
  daysSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  daysSelectorLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  disabledDayButton: {
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedDayButtonText: {
    color: COLORS.white,
  },
  permissionWarning: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#D32F2F',
    flex: 1,
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});