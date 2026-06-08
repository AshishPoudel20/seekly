import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  BackHandler,
  Platform,
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
import HomeScreen from './components/HomeScreen';
import HeroSpotlight from './components/HeroSpotlight';
import AppListItem from './components/AppListItem';
import AppDetailModal from './components/AppDetailModal';
import LoadingOverlay from './components/LoadingOverlay';

import { COLORS } from './theme';
import { searchApps } from './api';
import { WEB_MAX_WIDTH } from './utils/layout';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
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

  const [view, setView] = useState('home');
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
      setView('results');
    } catch (e) {
      setError(e.message);
      setData(null);
      setView('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleHome = useCallback(() => {
    setView('home');
    setData(null);
    setError(null);
    setCurrentQuery('');
    setSelectedApp(null);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const handleBackPress = () => {
      if (selectedApp) { setSelectedApp(null); return true; }
      if (searchOpen) { setSearchOpen(false); return true; }
      if (view !== 'home') { handleHome(); return true; }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => sub.remove();
  }, [selectedApp, searchOpen, view, handleHome]);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;
  }

  let body;
  if (loading) {
    body = <LoadingOverlay />;
  } else if (view === 'error') {
    body = (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>NO SIGNAL</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Check your internet connection and try again.
        </Text>
        <View style={styles.errorActions}>
          <Pressable
            onPress={handleHome}
            style={({ pressed }) => [styles.homeBtn, pressed && styles.pressed]}
          >
            <Text style={styles.homeBtnText}>← HOME</Text>
          </Pressable>
          <Pressable
            onPress={() => setSearchOpen(true)}
            style={({ pressed }) => [styles.retryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      </View>
    );
  } else if (view === 'home') {
    body = (
      <HomeScreen
        onSearchPress={() => setSearchOpen(true)}
        onAppPress={setSelectedApp}
      />
    );
  } else if (view === 'results') {
    body = (
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {data?.featured && (
          <HeroSpotlight app={data.featured} contextLine={data.contextLine} />
        )}

        <View style={styles.listWrap}>
          {data?.contextLine && data?.apps?.length > 0 && (
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

          {data?.apps?.map((app, i) => (
            <AppListItem
              key={`${app.id || app.name}-${i}`}
              app={app}
              index={i}
              onPress={() => setSelectedApp(app)}
            />
          ))}

          {(!data?.featured && data?.apps?.length === 0) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NOTHING FOUND</Text>
              <Text style={styles.emptyText}>
                Try rephrasing your search.
              </Text>
              <Pressable
                onPress={handleHome}
                style={({ pressed }) => [styles.homeBtn, pressed && styles.pressed, { marginTop: 24 }]}
              >
                <Text style={styles.homeBtnText}>← HOME</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  const showTopBar = (view === 'results' || view === 'error') && !loading;

  const shellStyle = Platform.OS === 'web' ? styles.webOuter : null;
  const frameStyle = Platform.OS === 'web' ? styles.webFrame : null;

  return (
    <View style={[styles.container, shellStyle]}>
      <View style={[styles.container, frameStyle]}>
        <ExpoStatusBar style="light" />
        {body}

        {showTopBar && (
          <TopBar
            onSearchPress={() => setSearchOpen(true)}
            onBackPress={handleHome}
            showBack={true}
          />
        )}

        <SearchOverlay
          visible={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          loading={loading}
        />

        <AppDetailModal
          app={selectedApp}
          query={currentQuery || null}
          visible={!!selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  webOuter: {
    alignItems: 'center',
    backgroundColor: '#06040c',
  },
  webFrame: {
    width: '100%',
    maxWidth: WEB_MAX_WIDTH,
  },
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
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  homeBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 100,
  },
  homeBtnText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
    color: COLORS.text,
    letterSpacing: 1.5,
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
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
