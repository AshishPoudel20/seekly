import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  RefreshControl,
  Platform,
} from 'react-native';
import HomeCategoryRow from './HomeCategoryRow';
import LoadingOverlay from './LoadingOverlay';
import { COLORS } from '../theme';
import { fetchHome } from '../api';
import { FALLBACK_HOME } from '../data/fallbackHome';

export default function HomeScreen({ onSearchPress, onAppPress }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const result = await fetchHome();
      setData(result);
    } catch (e) {
      // Use built-in home data when AI backend is rate-limited or down
      setData(FALLBACK_HOME);
      setError(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (data) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    load(true);
  };

  if (loading) return <LoadingOverlay message="LOADING" subMessage="curating your trending..." />;

  if (error) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>NO SIGNAL</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Check your internet connection and try again.
        </Text>
        <Pressable
          onPress={() => load()}
          style={({ pressed }) => [styles.retryBtn, pressed && styles.pressed]}
        >
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        {/* Hero header */}
        <View style={styles.hero}>
          {/* Ambient glow */}
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <Text style={styles.kicker}>SEEKLY · HOME</Text>
          <Text style={styles.headline}>
            What are you{'\n'}seeking today?
          </Text>
          <Text style={styles.subhead}>
            Tap any app or describe your need to find what's right for you.
          </Text>

          <Pressable
            onPress={onSearchPress}
            style={({ pressed }) => [styles.searchBar, pressed && styles.pressed]}
          >
            <Text style={styles.searchIcon}>⌕</Text>
            <Text style={styles.searchPlaceholder}>What do you want to do?</Text>
          </Pressable>
        </View>

        {/* Categories */}
        {data?.categories?.map((cat, i) => (
          <HomeCategoryRow
            key={`${cat.title}-${i}`}
            category={cat}
            onAppPress={onAppPress}
            rowIndex={i}
          />
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✦ pull down to refresh
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: {
    paddingTop: Platform.OS === 'web' ? 24 : Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 60,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.accent,
    opacity: 0.18,
  },
  glow2: {
    position: 'absolute',
    top: 50,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accentDeep,
    opacity: 0.15,
  },
  kicker: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 11,
    color: COLORS.accentGlow,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 44,
    color: COLORS.text,
    letterSpacing: -1.5,
    lineHeight: 48,
    marginBottom: 14,
  },
  subhead: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 15,
    color: COLORS.textDim,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 320,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 100,
  },
  searchIcon: {
    fontSize: 22,
    color: COLORS.accent,
  },
  searchPlaceholder: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 15,
    color: COLORS.muted,
  },
  pressed: { opacity: 0.75 },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1.5,
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
