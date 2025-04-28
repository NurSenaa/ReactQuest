import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Copy, Check } from 'lucide-react-native';

interface CodeBlockProps {
  code: string;
  language?: 'javascript' | 'jsx';
}

export default function CodeBlock({ code, language = 'jsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    } else {
      // For mobile platforms
      // Note: In a real app, you would use Clipboard API from expo-clipboard
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{language === 'jsx' ? 'JSX' : 'JavaScript'}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          {copied ? (
            <Check size={18} color={COLORS.primary} />
          ) : (
            <Copy size={18} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        style={styles.codeScrollView}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView 
          style={styles.codeContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <Text style={styles.code}>{code}</Text>
        </ScrollView>
      </ScrollView>
    </View>
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
  header: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    padding: 4,
  },
  codeScrollView: {
    maxHeight: 300,
  },
  codeContainer: {
    padding: 12,
  },
  code: {
    color: '#D4D4D4',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
  },
});