import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import PosterArt from './PosterArt';
import { COLORS } from '../theme';

const CARD_W = 146;
const CARD_H = 210;

export default function PosterCard({ app, index, onPress }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 400,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 7 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  };

  const pricingColor =
    app.pricing === 'Free' ? COLORS.success :
    app.pricing === 'Freemium' ? COLORS.gold :
    COLORS.accent;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY: translate }, { scale }],
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.card}>
          <PosterArt app={app} width={CARD_W} height={CARD_H} size="medium" />

          {/* Pricing badge top-right */}
          <View style={[styles.badge, { backgroundColor: pricingColor }]}>
            <Text style={styles.badgeText}>
              {app.pricing === 'Free' ? 'FREE' :
               app.pricing === 'Freemium' ? 'FREEMIUM' :
               app.pricing === 'Paid' ? 'PAID' : 'SUB'}
            </Text>
          </View>

          {/* Name overlay bottom */}
          <View style={styles.nameOverlay}>
            <Text style={styles.name} numberOfLines={2}>{app.name}</Text>
            <Text style={styles.category} numberOfLines={1}>
              {app.category?.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: 'Barlow_800ExtraBold',
    fontSize: 8,
    color: '#000',
    letterSpacing: 1,
  },
  nameOverlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
  },
  name: {
    fontFamily: 'Barlow_800ExtraBold',
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 17,
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4,
  },
  category: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 9,
    color: COLORS.textDim,
    letterSpacing: 1.5,
  },
});
