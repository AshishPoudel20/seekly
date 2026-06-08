import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { COLORS } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QuestionItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
    });
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, open && styles.containerOpen]}>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.questionRow, pressed && styles.pressed]}
      >
        <View style={styles.questionLeft}>
          <Text style={styles.qNumber}>0{index + 1}</Text>
          <Text style={styles.question}>{question}</Text>
        </View>
        <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>
          ▾
        </Animated.Text>
      </Pressable>

      {open && (
        <View style={styles.answerBox}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginBottom: 8,
    overflow: 'hidden',
  },
  containerOpen: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHi,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  questionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  qNumber: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 14,
    color: COLORS.accentGlow,
    letterSpacing: -0.5,
  },
  question: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 19,
  },
  chevron: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.accent,
  },
  pressed: { opacity: 0.7 },
  answerBox: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    marginTop: 4,
  },
  answer: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 21,
    marginTop: 12,
  },
});
