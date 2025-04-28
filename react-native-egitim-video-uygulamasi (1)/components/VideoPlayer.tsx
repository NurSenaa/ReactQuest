import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '@/constants/colors';

interface VideoPlayerProps {
  videoId: string;
  onLoad?: () => void;
}

export default function VideoPlayer({ videoId, onLoad }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  // YouTube embed HTML
  const youtubeHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #000;
          }
          .video-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div class="video-container">
          <iframe
            src="https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleLoad}
          style={{ border: 'none' }}
        />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: youtubeHTML }}
          style={styles.webView}
          onLoad={handleLoad}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
      )}
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Video yükleniyor...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 10,
    fontSize: 14,
  },
});