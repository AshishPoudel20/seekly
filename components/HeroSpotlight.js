import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PosterArt from './PosterArt';
import { impactMedium } from '../utils/haptics';
import { getPlatforms } from '../utils/appData';
import { COLORS } from '../theme';
import { openStorePage } from '../utils/storeLink';
import { useLayoutWidth } from '../utils/layout';

const HERO_HEIGHT = 540;

export default function HeroSpotlight({ app, contextLine, onPress }) {
  const width = useLayoutWidth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [app?.id]);

  const handleGet = (e) => {
    e?.stopPropagation?.();
    impactMedium();
    openStorePage(app);
  };

  if (!app) return null;

  const platforms = getPlatforms(app);

  return (
    <Pressable
      onPress={() => onPress?.(app)}
      style={[styles.container, { width, height: HERO_HEIGHT }]}
    >
      <PosterArt app={app} width={width} height={HERO_HEIGHT} size="hero" />

      <LinearGradient
        colors={['transparent', 'rgba(10,6,18,0.6)', COLORS.bg]}
        locations={[0.3, 0.7, 1]}
        style={styles.scrim}
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.topMetaRow}>
          <View style={styles.topMarkContainer}>
            <Text style={styles.topMark}>✦</Text>
          </View>
          <Text style={styles.topLabel}>SEEKLY'S TOP PICK</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{app.name}</Text>
        {app.tagline && <Text style={styles.tagline}>{app.tagline}</Text>}

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{app.category}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.meta}>{app.pricing}</Text>
          {platforms.length > 0 && (
            <>
              <View style={styles.metaDot} />
              <Text style={styles.meta}>{platforms.slice(0, 2).join(' · ')}</Text>
            </>
          )}
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {app.reason || app.description}
        </Text>

        <Pressable
          onPress={handleGet}
          style={({ pressed }) => [styles.getBtn, pressed && styles.pressed]}
        >
          <Text style={styles.getBtnText}>GET THE APP</Text>
          <Text style={styles.getBtnArrow}>→</Text>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.bg },
  scrim: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    left: 24, right: 24, bottom: 28,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  topMarkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topMark: {
    color: COLORS.text,
    fontSize: 11,
  },
  topLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.accentGlow,
  },
  title: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 52,
    color: COLORS.text,
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 16,
    color: COLORS.textDim,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  meta: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDim,
    letterSpacing: 1.2,
  },
  metaDot: {
    width: 3, height: 3, borderRadius: 2,
    backgroundColor: COLORS.muted,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 21,
    marginBottom: 22,
  },
  getBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 100,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  getBtnText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  getBtnArrow: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
    color: COLORS.text,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
