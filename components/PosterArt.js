import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from './AppIcon';
import { getAppGradient, getAppAccent } from '../utils/gradients';
import { COLORS, GRADIENTS } from '../theme';

export default function PosterArt({ app, width, height, size = 'medium' }) {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(3000 + Math.random() * 2000),
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoop.start();

    if (size === 'hero') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.08, duration: 8000, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        ])
      ).start();
    }

    return () => shimmerLoop.stop();
  }, []);

  const gradientColors = getAppGradient(app);
  const accent = getAppAccent(app);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width * 2],
  });

  const letterSize = size === 'hero' ? 180 : size === 'small' ? 64 : 96;
  const iconSize = size === 'hero' ? 140 : size === 'small' ? 50 : 80;

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius: size === 'hero' ? 0 : 10 },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.glow,
            {
              backgroundColor: accent,
              width: width * 0.7,
              height: width * 0.7,
              top: -width * 0.2,
              left: -width * 0.15,
            },
          ]}
        />

        <View style={styles.centerWrap}>
          <AppIcon
            app={app}
            size={iconSize}
            borderRadius={iconSize * 0.22}
            letterSize={letterSize}
          />
          <View
            style={[
              styles.iconShadow,
              {
                width: iconSize * 1.1,
                height: 20,
                bottom: -iconSize * 0.12,
              },
            ]}
          />
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmer,
            {
              width: width * 0.5,
              height: height * 2,
              transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.08)',
              'rgba(255,255,255,0.14)',
              'rgba(255,255,255,0.08)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <LinearGradient
          colors={GRADIENTS.posterScrim}
          style={styles.scrim}
          pointerEvents="none"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  letter: {
    fontFamily: 'Fraunces_900Black',
    letterSpacing: -2,
    opacity: 0.95,
    zIndex: 2,
  },
  letterShadow: {
    fontFamily: 'Fraunces_900Black',
    position: 'absolute',
    color: '#000',
    opacity: 0.25,
    transform: [{ translateX: 4 }, { translateY: 6 }],
  },
  iconShadow: {
    position: 'absolute',
    backgroundColor: '#000',
    borderRadius: 999,
    opacity: 0.35,
    transform: [{ scaleX: 1.2 }],
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.35,
  },
  shimmer: { position: 'absolute', top: -100 },
  scrim: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '55%',
  },
});
