import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import HomeCategoryRow from './HomeCategoryRow';
import { COLORS } from '../theme';
import { fetchHome } from '../api';
import {
  getInstantHome,
  hasHomeFetchedOnce,
  loadHomeOnce,
} from '../utils/homeCache';

export default function HomeScreen({ onSearchPress, onAppPress }) {
  const [data, setData] = useState(getInstantHome);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only curate trending once per app session — never again when returning from search
    if (hasHomeFetchedOnce() && getInstantHome()) {
      setData(getInstantHome());
      return;
    }

    let cancelled = false;
    loadHomeOnce(fetchHome).then((result) => {
      if (cancelled) return;
      setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
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

        {data?.categories?.map((cat, i) => (
          <HomeCategoryRow
            key={`${cat.title}-${i}`}
            category={cat}
            onAppPress={onAppPress}
            rowIndex={i}
          />
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>✦ seek what you need</Text>
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
});
