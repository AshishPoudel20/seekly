import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppIcon from './AppIcon';
import { COLORS } from '../theme';
import { impactLight } from '../utils/haptics';
import { openStorePage } from '../utils/storeLink';

export default function AppListItem({ app, index, onPress }) {
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
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 7 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  };

  const handleGet = (e) => {
    e.stopPropagation?.();
    impactLight();
    openStorePage(app);
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
          {/* Row: Icon + Title + Get Button */}
          <View style={styles.row}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <AppIcon app={app} size={56} borderRadius={14} />
            </View>

            {/* Title + Meta */}
            <View style={styles.textCol}>
              <Text style={styles.name} numberOfLines={1}>{app.name}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.pricingDot, { backgroundColor: pricingColor }]} />
                <Text style={styles.pricing}>{app.pricing?.toUpperCase()}</Text>
                <Text style={styles.metaSep}>·</Text>
                <Text style={styles.category} numberOfLines={1}>
                  {app.category}
                </Text>
              </View>
            </View>

            {/* Get Button */}
            <Pressable
              onPress={handleGet}
              style={({ pressed }) => [
                styles.getBtn,
                pressed && styles.getBtnPressed,
              ]}
            >
              <Text style={styles.getBtnText}>GET</Text>
            </Pressable>
          </View>

          {/* Contextual reason — the line about why it matches the search */}
          {app.reason && (
            <View style={styles.reasonBox}>
              <View style={styles.reasonBar} />
              <Text style={styles.reason} numberOfLines={2}>
                {app.reason}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceHi,
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pricingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  pricing: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: COLORS.textDim,
    letterSpacing: 1,
  },
  metaSep: {
    color: COLORS.muted,
    fontSize: 10,
  },
  category: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: COLORS.textDim,
    flex: 1,
  },
  getBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  getBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  getBtnText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 11,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  reasonBox: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    alignItems: 'flex-start',
  },
  reasonBar: {
    width: 3,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginTop: 2,
    marginBottom: 2,
  },
  reason: {
    flex: 1,
    fontFamily: 'Fraunces_400Regular',
    fontSize: 13,
    color: COLORS.textDim,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});
