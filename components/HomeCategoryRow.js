import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import HomeAppCard from './HomeAppCard';
import { COLORS } from '../theme';

export default function HomeCategoryRow({ category, onAppPress, rowIndex = 0 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: rowIndex * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: rowIndex * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!category.apps || category.apps.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.title}>{category.title}</Text>
        </View>
        {category.subtitle && (
          <Text style={styles.subtitle}>{category.subtitle}</Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        nestedScrollEnabled
      >
        {category.apps.map((item, index) => (
          <HomeAppCard
            key={`${category.title}-${item.id || item.name}-${index}`}
            app={item}
            index={index}
            onPress={() => onAppPress(item)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  accentBar: {
    width: 4,
    height: 22,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 0.3,
    marginLeft: 14,
  },
  list: {
    paddingHorizontal: 14,
    gap: 12,
  },
});
