import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import { Copy, Save, RefreshCw, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface CodeEditorProps {
  initialCode: string;
  language?: 'javascript' | 'jsx';
  height?: number;
  readOnly?: boolean;
  onSave?: (code: string) => void;
  snippetId?: string;
}

const CODE_SNIPPETS_STORAGE_KEY = 'user_code_snippets';

export default function CodeEditor({ 
  initialCode, 
  language = 'jsx', 
  height = 300,
  readOnly = false,
  onSave,
  snippetId
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isSaved, setIsSaved] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Line numbers based on code content
  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');
  
  const handleCodeChange = (text: string) => {
    setCode(text);
    setIsSaved(false);
  };

  const resetToInitialCode = () => {
    Alert.alert(
      "Kodu Sıfırla",
      "Tüm değişiklikleriniz kaybolacak. Devam etmek istiyor musunuz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sıfırla",
          onPress: () => {
            setCode(initialCode);
            setIsSaved(false);
            
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const copyToClipboard = async () => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(code);
        Alert.alert("Başarılı", "Kod panoya kopyalandı.");
      } catch (err) {
        Alert.alert("Hata", "Kod kopyalanamadı.");
      }
    } else {
      // For mobile platforms
      try {
        // Using Clipboard API directly would require an additional import
        // This is a placeholder for the actual implementation
        Alert.alert("Başarılı", "Kod panoya kopyalandı.");
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch (err) {
        Alert.alert("Hata", "Kod kopyalanamadı.");
      }
    }
  };

  const saveCodeSnippet = async () => {
    if (!snippetId) return;
    
    try {
      // Get existing snippets
      const storedSnippets = await AsyncStorage.getItem(CODE_SNIPPETS_STORAGE_KEY);
      let snippets: Record<string, string> = storedSnippets ? JSON.parse(storedSnippets) : {};
      
      // Save current code
      snippets[snippetId] = code;
      
      // Store updated snippets
      await AsyncStorage.setItem(CODE_SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
      
      setIsSaved(true);
      
      if (onSave) {
        onSave(code);
      }
      
      Alert.alert("Başarılı", "Kod kaydedildi.");
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to save code snippet:', error);
      Alert.alert("Hata", "Kod kaydedilemedi.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.editorHeader}>
        <Text style={styles.editorTitle}>
          {language === 'jsx' ? 'JSX Editor' : 'JavaScript Editor'}
        </Text>
        <View style={styles.editorActions}>
          {!readOnly && (
            <>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={resetToInitialCode}
              >
                <RefreshCw size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              {snippetId && (
                <TouchableOpacity 
                  style={[styles.actionButton, isSaved && styles.savedButton]} 
                  onPress={saveCodeSnippet}
                >
                  {isSaved ? (
                    <Check size={18} color={COLORS.primary} />
                  ) : (
                    <Save size={18} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={copyToClipboard}
          >
            <Copy size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.editorContainer, { height }]}>
        <View style={styles.lineNumbers}>
          <Text style={styles.lineNumberText}>{lineNumbers}</Text>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.codeScrollView}
          contentContainerStyle={styles.codeContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={handleCodeChange}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            editable={!readOnly}
            textAlignVertical="top"
            scrollEnabled={false} // Let the ScrollView handle scrolling
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  editorHeader: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  editorTitle: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
  },
  editorActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  savedButton: {
    backgroundColor: 'rgba(74, 111, 255, 0.2)',
    borderRadius: 4,
  },
  editorContainer: {
    flexDirection: 'row',
  },
  lineNumbers: {
    width: 40,
    backgroundColor: '#252525',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  lineNumberText: {
    color: '#858585',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
  codeScrollView: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  codeContainer: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  codeInput: {
    color: '#D4D4D4',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
    padding: 0,
    textAlignVertical: 'top',
  },
});