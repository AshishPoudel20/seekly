import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../theme';

const { height } = Dimensions.get('window');

export default function SplashScreen({ onSearchPress }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const markSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(markSpin, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = markSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Ambient orbs */}
      <View style={styles.bgOrb1} />
      <View style={styles.bgOrb2} />
      <View style={styles.bgOrb3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo mark */}
        <Animated.View style={[styles.logoMark, { transform: [{ rotate: spin }] }]}>
          <View style={styles.logoInner}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
        </Animated.View>

        <Text style={styles.brand}>seekly</Text>
        <Text style={styles.tagline}>
          the app you need, for anything you do.
        </Text>

        <Animated.View style={{ transform: [{ scale: pulse }], marginTop: 56 }}>
          <Pressable
            onPress={onSearchPress}
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.pressed]}
          >
            <Text style={styles.ctaIcon}>⌕</Text>
            <Text style={styles.ctaText}>BEGIN SEEKING</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.features}>
          <Feature text="AI CURATED" />
          <View style={styles.featureDivider} />
          <Feature text="INSTANT RESULTS" />
          <View style={styles.featureDivider} />
          <Feature text="HAND PICKED" />
        </View>
      </Animated.View>
    </View>
  );
}

const Feature = ({ text }) => (
  <Text style={styles.featureText}>{text}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  bgOrb1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: COLORS.accent,
    opacity: 0.18,
  },
  bgOrb2: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: COLORS.accentDeep,
    opacity: 0.22,
  },
  bgOrb3: {
    position: 'absolute',
    top: height * 0.4,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.accentGlow,
    opacity: 0.08,
  },
  content: { alignItems: 'center' },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 34,
    color: COLORS.text,
  },
  brand: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 72,
    color: COLORS.text,
    letterSpacing: -2.5,
    marginBottom: 10,
  },
  tagline: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 17,
    color: COLORS.textDim,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 300,
    lineHeight: 24,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 38,
    paddingVertical: 18,
    borderRadius: 100,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.6,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  ctaIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  ctaText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 2,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  features: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 60,
  },
  featureText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: COLORS.textDim,
    letterSpacing: 1.8,
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
  },
});
