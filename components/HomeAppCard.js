import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
} from 'react-native';
import { COLORS } from '../theme';
import { getAppAccent } from '../utils/gradients';

const CARD_W = 110;

export default function HomeAppCard({ app, index, onPress }) {
  const [iconFailed, setIconFailed] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 7 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  };

  const hasIcon = app.iconUrl && !iconFailed;
  const accent = getAppAccent(app);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          {hasIcon ? (
            <Image
              source={{ uri: app.iconUrl }}
              style={styles.icon}
              onError={() => setIconFailed(true)}
            />
          ) : (
            <View style={[styles.iconFallback, { backgroundColor: accent }]}>
              <Text style={styles.iconLetter}>
                {(app.name || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.name} numberOfLines={1}>{app.name}</Text>
        <Text style={styles.category} numberOfLines={1}>
          {app.category}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    alignItems: 'center',
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceHi,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  icon: {
    width: 76,
    height: 76,
  },
  iconFallback: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 32,
    color: '#fff',
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
    width: CARD_W,
  },
  category: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: COLORS.muted,
    textAlign: 'center',
    width: CARD_W,
  },
});
