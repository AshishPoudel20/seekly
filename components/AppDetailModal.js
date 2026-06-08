import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  useWindowDimensions,
  Platform,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PosterArt from './PosterArt';
import { impactMedium } from '../utils/haptics';
import QuestionItem from './QuestionItem';
import { COLORS } from '../theme';
import { openStorePage } from '../utils/storeLink';
import { fetchAppDetails } from '../api';
import { useLayoutWidth } from '../utils/layout';
import { getPlatforms } from '../utils/appData';

export default function AppDetailModal({ app, query, visible, onClose }) {
  const { height: windowHeight } = useWindowDimensions();
  const width = useLayoutWidth();
  const isWeb = Platform.OS === 'web';
  const slideAnim = useRef(new Animated.Value(isWeb ? 0 : windowHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch details when modal opens with new app
  useEffect(() => {
    if (visible && app) {
      setDetails(null);
      setDetailsLoading(true);
      fetchAppDetails(app, query)
        .then(setDetails)
        .catch(err => console.warn('Details fetch failed:', err.message))
        .finally(() => setDetailsLoading(false));
    }
  }, [visible, app?.id, app?.name, query]);

  const handleClose = useCallback(() => {
    const animations = [
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ];
    if (!isWeb) {
      animations.unshift(
        Animated.timing(slideAnim, { toValue: windowHeight, duration: 250, useNativeDriver: true })
      );
    }
    Animated.parallel(animations).start(() => onClose());
  }, [fadeAnim, isWeb, onClose, slideAnim, windowHeight]);

  useEffect(() => {
    if (visible) {
      if (!isWeb) {
        slideAnim.setValue(windowHeight);
      }
      const animations = [
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ];
      if (!isWeb) {
        animations.unshift(
          Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true })
        );
      }
      Animated.parallel(animations).start();
    } else {
      slideAnim.setValue(isWeb ? 0 : windowHeight);
      fadeAnim.setValue(0);
    }
  }, [visible, isWeb, windowHeight, fadeAnim, slideAnim]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, handleClose]);

  const handleGet = () => {
    if (!app) return;
    impactMedium();
    openStorePage(app);
  };

  if (!app) return null;

  const pricingColor =
    app.pricing === 'Free' ? COLORS.success :
    app.pricing === 'Freemium' ? COLORS.gold :
    COLORS.accent;
  const platforms = getPlatforms(app);

  const sheet = (
      <Animated.View
        style={[
          styles.sheet,
          isWeb && styles.sheetWeb,
          !isWeb && { transform: [{ translateY: slideAnim }] },
          isWeb && { opacity: fadeAnim, maxHeight: Math.min(windowHeight * 0.9, 820) },
        ]}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={handleClose} style={styles.backBtn} hitSlop={10}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>BACK</Text>
          </Pressable>
          <Pressable onPress={handleClose} style={styles.closeBtn} hitSlop={10}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { width, height: isWeb ? 280 : 360 }]}>
            <PosterArt app={app} width={width} height={isWeb ? 280 : 360} size="hero" />
            <LinearGradient
              colors={['transparent', 'rgba(10,6,18,0.6)', COLORS.bg]}
              locations={[0.3, 0.7, 1]}
              style={styles.heroScrim}
            />
          </View>

          <View style={styles.content}>
            {/* Title block */}
            <Text style={styles.name}>{app.name}</Text>
            {app.tagline && <Text style={styles.tagline}>"{app.tagline}"</Text>}

            <View style={styles.metaRow}>
              <View style={[styles.pricingChip, { borderColor: pricingColor }]}>
                <View style={[styles.pricingDot, { backgroundColor: pricingColor }]} />
                <Text style={styles.pricingText}>{app.pricing?.toUpperCase()}</Text>
              </View>
              <Text style={styles.categoryText}>{app.category?.toUpperCase()}</Text>
            </View>

            {/* Get button */}
            <Pressable
              onPress={handleGet}
              style={({ pressed }) => [styles.getBtn, pressed && styles.pressed]}
            >
              <Text style={styles.getBtnText}>GET THE APP</Text>
              <Text style={styles.getBtnArrow}>→</Text>
            </Pressable>

            {/* Why it fits (only when search context) */}
            {app.reason && (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>WHY IT FITS</Text>
                <Text style={styles.reasonText}>{app.reason}</Text>
              </View>
            )}

            {/* About */}
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <Text style={styles.description}>{app.description}</Text>

            {/* === USE CASES === */}
            {detailsLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.accent} />
                <Text style={styles.loadingText}>Loading more details...</Text>
              </View>
            )}

            {details?.useCases?.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>WHAT YOU CAN DO</Text>
                <View style={styles.useCasesList}>
                  {details.useCases.map((uc, i) => (
                    <View key={i} style={styles.useCaseRow}>
                      <Text style={styles.useCaseIcon}>{uc.icon}</Text>
                      <Text style={styles.useCaseText}>{uc.text}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* === THINGS TO KNOW === */}
            {details?.thingsToKnow?.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>THINGS TO KNOW</Text>
                <View style={styles.thingsList}>
                  {details.thingsToKnow.map((t, i) => (
                    <View key={i} style={styles.thingRow}>
                      <Text style={styles.thingIcon}>{t.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.thingLabel}>{t.label}</Text>
                        <Text style={styles.thingValue}>{t.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* === COMMON QUESTIONS === */}
            {details?.questions?.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>COMMON QUESTIONS</Text>
                <Text style={styles.qHint}>Tap any question to expand</Text>
                {details.questions.map((qa, i) => (
                  <QuestionItem
                    key={i}
                    index={i}
                    question={qa.q}
                    answer={qa.a}
                  />
                ))}
              </>
            )}

            {/* Platforms */}
            {platforms.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>AVAILABLE ON</Text>
                <View style={styles.platforms}>
                  {platforms.map(p => (
                    <View key={p} style={styles.platformChip}>
                      <Text style={styles.platformText}>{p}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={{ height: 60 }} />
          </View>
        </ScrollView>
      </Animated.View>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {isWeb ? (
        <View style={styles.webSheetWrap} pointerEvents="box-none">
          {sheet}
        </View>
      ) : (
        sheet
      )}
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
  webSheetWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheetWeb: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 720,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    zIndex: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10,6,18,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  backArrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  backText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: COLORS.text,
    letterSpacing: 1.2,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10,6,18,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: COLORS.text, fontSize: 18 },
  hero: {},
  heroScrim: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '60%',
  },
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
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 11,
    color: COLORS.accentGlow,
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 18,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDim,
    lineHeight: 21,
    marginBottom: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 14,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  // Use cases
  useCasesList: {
    gap: 10,
    marginBottom: 4,
  },
  useCaseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  useCaseIcon: {
    fontSize: 22,
    marginTop: -2,
  },
  useCaseText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  // Things to know
  thingsList: {
    gap: 8,
    marginBottom: 4,
  },
  thingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  thingIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  thingLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: COLORS.accentGlow,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  thingValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textDim,
    lineHeight: 18,
  },
  // Q&A
  qHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.muted,
    fontStyle: 'italic',
    marginBottom: 10,
    marginTop: -4,
  },
  // Platforms
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
