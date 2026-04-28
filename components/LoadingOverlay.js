import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme';

export default function LoadingOverlay() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    };
    animate(anim1, 0);
    animate(anim2, 200);
    animate(anim3, 400);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        <Animated.View style={[styles.bar, { opacity: anim1, transform: [{ scaleY: anim1.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }]} />
        <Animated.View style={[styles.bar, { opacity: anim2, transform: [{ scaleY: anim2.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }]} />
        <Animated.View style={[styles.bar, { opacity: anim3, transform: [{ scaleY: anim3.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }]} />
      </View>
      <Text style={styles.text}>SEEKING</Text>
      <Text style={styles.subtext}>finding your perfect match...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    marginBottom: 28,
  },
  bar: {
    width: 5,
    height: 40,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  text: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
    color: COLORS.accentGlow,
    letterSpacing: 4,
    marginBottom: 6,
  },
  subtext: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 14,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
});
