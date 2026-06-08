import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

export function TopBar({ onSearchPress, onBackPress, showBack = false }) {
  return (
    <View style={styles.topBar}>
      <LinearGradient
        colors={['rgba(10,6,18,0.95)', 'rgba(10,6,18,0.7)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.topBarInner}>
        {showBack ? (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            hitSlop={10}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>HOME</Text>
          </Pressable>
        ) : (
          <View style={styles.logoWrap}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>S</Text>
            </View>
            <Text style={styles.logo}>seekly</Text>
          </View>
        )}
        <Pressable onPress={onSearchPress} style={styles.searchIconBtn} hitSlop={10}>
          <Text style={styles.searchIcon}>⌕</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function SearchOverlay({ visible, onClose, onSearch, loading }) {
  const [query, setQuery] = React.useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else {
      slideAnim.setValue(-100);
      fadeAnim.setValue(0);
      setQuery('');
    }
  }, [visible]);

  const handleSubmit = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    onSearch(s);
  };

  const SUGGESTIONS = [
    'edit videos on my phone',
    'learn a language',
    'track expenses',
    'meditation for sleep',
    'create logos',
    'find recipes',
    'workout at home',
    'journal daily',
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.searchPanel,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <View style={styles.searchRow}>
          {/* Back arrow at the start */}
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.searchBackArrow}>←</Text>
          </Pressable>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="What do you want to do?"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.suggestLabel}>POPULAR SEARCHES</Text>
        <View style={styles.chips}>
          {SUGGESTIONS.map(s => (
            <Pressable
              key={s}
              onPress={() => handleSuggestion(s)}
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 34,
    paddingBottom: 14,
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 17,
    color: COLORS.text,
  },
  logo: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingRight: 12,
  },
  backArrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: COLORS.text,
  },
  backText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  pressed: { opacity: 0.6 },
  searchIconBtn: { padding: 4 },
  searchIcon: {
    fontSize: 26,
    color: COLORS.text,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,6,18,0.95)',
  },
  searchPanel: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    paddingTop: Platform.OS === 'web' ? 24 : Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
    paddingBottom: 12,
    marginBottom: 28,
  },
  searchBackArrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: COLORS.accent,
  },
  input: {
    flex: 1,
    fontFamily: 'Fraunces_500Medium',
    fontSize: 18,
    color: COLORS.text,
    paddingVertical: 6,
  },
  clearBtn: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.muted,
    paddingHorizontal: 4,
  },
  suggestLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 2,
    marginBottom: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
  },
  chipPressed: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.text,
  },
});
