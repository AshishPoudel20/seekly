import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import PosterCard from './PosterCard';
import { COLORS } from '../theme';

export default function CategoryShelf({ title, apps, onAppPress, shelfIndex = 0 }) {
  if (!apps || apps.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.accentBar} />
      </View>

      <FlatList
        horizontal
        data={apps}
        keyExtractor={(item, idx) => `${item.id || item.name}-${idx}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <PosterCard
            app={item}
            index={index}
            onPress={() => onAppPress(item)}
          />
        )}
        snapToInterval={156}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    letterSpacing: 1.5,
    color: COLORS.text,
  },
  accentBar: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 14,
    gap: 10,
  },
});
