import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { buildAppIconSources } from '../utils/appIcon';
import { getAppAccent } from '../utils/gradients';
import { COLORS } from '../theme';

export default function AppIcon({
  app,
  size,
  style,
  borderRadius,
  letterSize,
  textStyle,
}) {
  const [sources, setSources] = useState([]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSourceIndex(0);
    setSources([]);
    setReady(false);

    buildAppIconSources(app).then((list) => {
      if (!cancelled) {
        setSources(list);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [app?.iconUrl, app?.iosAppId, app?.androidPackageId, app?.id, app?.name, app?.url]);

  const current = sources[sourceIndex];
  const uri = current?.url;
  const radius = borderRadius ?? size * 0.26;
  const accent = getAppAccent(app);
  const letter = (app?.name || '?').charAt(0).toUpperCase();

  useEffect(() => {
    if (__DEV__ && uri && current?.source) {
      console.log(`[AppIcon] ${app?.name || '?'} → ${current.source}`);
    }
  }, [uri, current?.source, app?.name]);

  const frameStyle = {
    width: size,
    height: size,
    borderRadius: radius,
  };

  if (!ready) {
    return <View style={[styles.placeholder, frameStyle, style]} />;
  }

  if (!uri || failed) {
    if (__DEV__) {
      console.log(`[AppIcon] ${app?.name || '?'} → letter fallback`);
    }
    return (
      <View style={[styles.fallback, frameStyle, { backgroundColor: accent }, style]}>
        <Text style={[styles.letter, { fontSize: letterSize || size * 0.42 }, textStyle]}>
          {letter}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[frameStyle, style]}
      onError={() => {
        if (sourceIndex + 1 < sources.length) {
          setSourceIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: COLORS.surfaceHi,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: 'Fraunces_900Black',
    color: '#fff',
  },
});
