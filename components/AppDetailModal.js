import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PosterArt from './PosterArt';
import { COLORS } from '../theme';
import { openStorePage } from '../utils/storeLink';

const { width, height } = Dimensions.get('window');

export default function AppDetailModal({ app, visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    } else {
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const handleGet = () => {
    if (!app) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    openStorePage(app);
  };

  if (!app) return null;

  const pricingColor =
    app.pricing === 'Free' ? COLORS.success :
    app.pricing === 'Freemium' ? COLORS.gold :
    COLORS.accent;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <PosterArt app={app} width={width} height={360} size="hero" />
            <LinearGradient
              colors={['transparent', 'rgba(10,6,18,0.6)', COLORS.bg]}
              locations={[0.3, 0.7, 1]}
              style={styles.heroScrim}
            />
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>{app.name}</Text>
            {app.tagline && <Text style={styles.tagline}>"{app.tagline}"</Text>}

            <View style={styles.metaRow}>
              <View style={[styles.pricingChip, { borderColor: pricingColor }]}>
                <View style={[styles.pricingDot, { backgroundColor: pricingColor }]} />
                <Text style={styles.pricingText}>{app.pricing?.toUpperCase()}</Text>
              </View>
              <Text style={styles.categoryText}>{app.category?.toUpperCase()}</Text>
            </View>

            <Pressable
              onPress={handleGet}
              style={({ pressed }) => [styles.getBtn, pressed && styles.pressed]}
            >
              <Text style={styles.getBtnText}>GET THE APP</Text>
              <Text style={styles.getBtnArrow}>→</Text>
            </Pressable>

            {app.reason && (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>WHY IT FITS</Text>
                <Text style={styles.reasonText}>{app.reason}</Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>ABOUT</Text>
            <Text style={styles.description}>{app.description}</Text>

            {app.platforms && app.platforms.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>AVAILABLE ON</Text>
                <View style={styles.platforms}>
                  {app.platforms.map(p => (
                    <View key={p} style={styles.platformChip}>
                      <Text style={styles.platformText}>{p}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,6,18,0.85)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, top: 50, bottom: 0,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  hero: { width, height: 360 },
  heroScrim: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '60%',
  },
  closeBtn: {
    position: 'absolute',
    top: 16, right: 16,
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10,6,18,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: COLORS.text, fontSize: 18 },
  content: { padding: 24, marginTop: -80 },
  name: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 42,
    color: COLORS.text,
    letterSpacing: -1.2,
    lineHeight: 46,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 15,
    color: COLORS.textDim,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  pricingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  pricingDot: { width: 6, height: 6, borderRadius: 3 },
  pricingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: COLORS.text,
    letterSpacing: 1,
  },
  categoryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDim,
    letterSpacing: 1.5,
  },
  getBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 100,
    marginBottom: 22,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
  getBtnText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  getBtnArrow: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
    color: COLORS.text,
  },
  pressed: { opacity: 0.75 },
  reasonBox: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 22,
  },
  reasonLabel: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 10,
    color: COLORS.accentGlow,
    letterSpacing: 2,
    marginBottom: 6,
  },
  reasonText: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 6,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 21,
    marginBottom: 20,
  },
  platforms: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  platformChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  platformText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDim,
    letterSpacing: 0.8,
  },
});
