import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager, Image } from 'react-native';
import { ChevronDown, ChevronUp, CheckCircle, Play } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import CodeBlock from './CodeBlock';
import { useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  content: string;
  codeExample?: string;
  practiceSection?: string;
  videoId?: string;
  isCompleted?: boolean;
  onToggleCompletion?: () => void;
}

export default function AccordionItem({ 
  title, 
  content, 
  codeExample, 
  practiceSection, 
  videoId,
  isCompleted = false,
  onToggleCompletion
}: AccordionItemProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const navigateToVideo = () => {
    if (videoId) {
      router.push({
        pathname: '/video/[id]',
        params: { 
          id: videoId,
          source: 'learn'
        }
      });
    }
  };

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <TouchableOpacity 
        style={[styles.header, expanded && styles.headerExpanded]} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, isCompleted && styles.completedTitle]}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color={COLORS.primary} />
        ) : (
          <ChevronDown size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          {videoId && (
            <TouchableOpacity 
              style={styles.videoPreview}
              onPress={navigateToVideo}
              activeOpacity={0.8}
            >
              <Image 
                source={{ 
                  uri: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
                }}
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              <View style={styles.playButton}>
                <Play size={24} color={COLORS.white} fill={COLORS.white} />
              </View>
              <Text style={styles.watchVideoText}>Video Dersini İzle</Text>
            </TouchableOpacity>
          )}
          
          <Text style={styles.contentText}>{content}</Text>
          
          {codeExample && (
            <CodeBlock code={codeExample} />
          )}
          
          {practiceSection && (
            <View style={styles.practiceSection}>
              <Text style={styles.practiceSectionTitle}>Uygulamada Uygula</Text>
              <Text style={styles.practiceSectionText}>{practiceSection}</Text>
            </View>
          )}
          
          {onToggleCompletion && (
            <TouchableOpacity 
              style={[
                styles.completionButton,
                isCompleted && styles.completedButton
              ]}
              onPress={onToggleCompletion}
            >
              {isCompleted ? (
                <>
                  <CheckCircle size={20} color={COLORS.white} />
                  <Text style={styles.completionButtonText}>Tamamlandı</Text>
                </>
              ) : (
                <Text style={styles.completionButtonText}>Dersi Tamamla</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.cardBackground,
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  completedTitle: {
    color: COLORS.primary,
  },
  content: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  videoPreview: {
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchVideoText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: COLORS.white,
    padding: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  practiceSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  practiceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  practiceSectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  completedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  completionButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  completedButtonText: {
    color: COLORS.white,
  },
});