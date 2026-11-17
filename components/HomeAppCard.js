import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import AppIcon from './AppIcon';
import { COLORS } from '../theme';

const CARD_W = 110;

export default function HomeAppCard({ app, index, onPress }) {
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

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <AppIcon app={app} size={76} borderRadius={20} />
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
