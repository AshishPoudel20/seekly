import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { TopBar, SearchOverlay } from './components/TopBar';
import SplashScreen from './components/SplashScreen';
import HeroSpotlight from './components/HeroSpotlight';
import AppListItem from './components/AppListItem';
import AppDetailModal from './components/AppDetailModal';
import LoadingOverlay from './components/LoadingOverlay';

import { COLORS } from './theme';
import { searchApps } from './api';

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = useCallback(async (query) => {
    setSearchOpen(false);
    setCurrentQuery(query);
    setLoading(true);
    setError(null);
    try {
      const result = await searchApps(query);
      setData({
        contextLine: result.contextLine || '',
        featured: result.featured,
        apps: result.apps || [],
      });
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;
  }

  let body;
  if (loading) {
    body = <LoadingOverlay />;
  } else if (error) {
    body = (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>NO SIGNAL</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Check your internet connection and try again.
        </Text>
        <Pressable onPress={() => setSearchOpen(true)} style={styles.retryBtn}>
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </Pressable>
      </View>
    );
  } else if (!data) {
    body = <SplashScreen onSearchPress={() => setSearchOpen(true)} />;
  } else {
    body = (
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {data.featured && (
          <HeroSpotlight app={data.featured} contextLine={data.contextLine} />
        )}

        <View style={styles.listWrap}>
          {/* Context headline for the list */}
          {data.contextLine && data.apps.length > 0 && (
            <View style={styles.listHeader}>
              <View style={styles.listHeaderLine} />
              <Text style={styles.listHeaderText}>
                {data.contextLine}
              </Text>
              <Text style={styles.listHeaderSub}>
                {data.apps.length} alternatives for "{currentQuery}"
              </Text>
            </View>
          )}

          {data.apps.map((app, i) => (
            <AppListItem
              key={`${app.id || app.name}-${i}`}
              app={app}
              index={i}
              onPress={() => setSelectedApp(app)}
            />
          ))}

          {(!data.featured && data.apps.length === 0) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NOTHING FOUND</Text>
              <Text style={styles.emptyText}>
                Try rephrasing your search.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      {body}

      {data && !loading && (
        <TopBar onSearchPress={() => setSearchOpen(true)} />
      )}

      <SearchOverlay
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
        loading={loading}
      />

      <AppDetailModal
        app={selectedApp}
        visible={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  listWrap: {
    paddingTop: 28,
    paddingHorizontal: 18,
  },
  listHeader: {
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  listHeaderLine: {
    width: 30,
    height: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginBottom: 12,
  },
  listHeaderText: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 24,
    color: COLORS.text,
    letterSpacing: -0.8,
    lineHeight: 28,
    marginBottom: 4,
  },
  listHeaderSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 32,
    color: COLORS.text,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },
  errorScreen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 42,
    color: COLORS.accent,
    letterSpacing: -1,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 100,
  },
  retryText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
    color: COLORS.text,
    letterSpacing: 2,
  },
});
