import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import CodeEditor from './CodeEditor';
import { Code, Save, Play, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface CodePlaygroundProps {
  title: string;
  description?: string;
  initialCode: string;
  snippetId: string;
}

const CODE_SNIPPETS_STORAGE_KEY = 'user_code_snippets';

export default function CodePlayground({ 
  title, 
  description, 
  initialCode,
  snippetId
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // Load saved code on mount
  useEffect(() => {
    loadSavedCode();
  }, [snippetId]);
  
  const loadSavedCode = async () => {
    try {
      setLoading(true);
      const storedSnippets = await AsyncStorage.getItem(CODE_SNIPPETS_STORAGE_KEY);
      
      if (storedSnippets) {
        const snippets = JSON.parse(storedSnippets);
        if (snippets[snippetId]) {
          setCode(snippets[snippetId]);
        }
      }
    } catch (error) {
      console.error('Failed to load saved code:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCodeSave = (newCode: string) => {
    setCode(newCode);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const resetCode = async () => {
    try {
      // Get existing snippets
      const storedSnippets = await AsyncStorage.getItem(CODE_SNIPPETS_STORAGE_KEY);
      let snippets: Record<string, string> = storedSnippets ? JSON.parse(storedSnippets) : {};
      
      // Remove current snippet
      if (snippets[snippetId]) {
        delete snippets[snippetId];
        
        // Store updated snippets
        await AsyncStorage.setItem(CODE_SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
      }
      
      // Reset to initial code
      setCode(initialCode);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.error('Failed to reset code:', error);
    }
  };
  
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Kod yükleniyor...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Code size={20} color={COLORS.primary} />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={resetCode}
          >
            <RefreshCw size={18} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>Sıfırla</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.previewButton]} 
            onPress={togglePreview}
          >
            <Play size={18} color={COLORS.white} />
            <Text style={styles.previewButtonText}>
              {previewVisible ? 'Editöre Dön' : 'Önizleme'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {previewVisible ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Önizleme</Text>
            <Text style={styles.previewSubtitle}>
              (Gerçek çalıştırma ortamı değil, sadece kod gösterimi)
            </Text>
          </View>
          
          <ScrollView style={styles.previewContent}>
            <CodeEditor
              initialCode={code}
              height={300}
              readOnly={true}
            />
            
            <View style={styles.previewNote}>
              <Text style={styles.previewNoteText}>
                Not: Bu bir simülasyon önizlemesidir. Gerçek bir React Native çalıştırma ortamı değildir.
                Kodunuzu gerçek bir React Native projesinde test etmeniz önerilir.
              </Text>
            </View>
          </ScrollView>
        </View>
      ) : (
        <CodeEditor
          initialCode={code}
          height={350}
          snippetId={snippetId}
          onSave={handleCodeSave}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
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
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    padding: 16,
    paddingTop: 0,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  previewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
  },
  previewButtonText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  previewContainer: {
    padding: 16,
  },
  previewHeader: {
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  previewSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  previewContent: {
    maxHeight: 400,
  },
  previewNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  previewNoteText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  }
});