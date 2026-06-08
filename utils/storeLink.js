import { Linking, Platform } from 'react-native';
import { resolveStoreIds } from './knownApps';

const iosLookupCache = new Map();

function normalizeName(name) {
  return (name || '').trim().toLowerCase();
}

async function lookupIosAppId(appName) {
  const key = normalizeName(appName);
  if (!key) return null;
  if (iosLookupCache.has(key)) return iosLookupCache.get(key);

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&entity=software&limit=8`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const results = data.results || [];
    const exact = results.find(
      (item) => normalizeName(item.trackName) === key
    );
    const match = exact || results[0];
    const id = match?.trackId ? String(match.trackId) : null;
    iosLookupCache.set(key, id);
    return id;
  } catch {
    return null;
  }
}

async function openUrl(url) {
  await Linking.openURL(url);
}

export async function openStorePage(app) {
  if (!app) return;

  const name = app.name || 'app';
  const { androidPackageId, iosAppId: knownIosId } = resolveStoreIds(app);

  if (Platform.OS === 'android') {
    if (androidPackageId) {
      return openUrl(
        `https://play.google.com/store/apps/details?id=${androidPackageId}`
      );
    }
    return openUrl(
      `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`
    );
  }

  if (Platform.OS === 'ios') {
    let iosAppId = knownIosId;
    if (!iosAppId) {
      iosAppId = await lookupIosAppId(name);
    }
    if (iosAppId) {
      return openUrl(`https://apps.apple.com/app/id${iosAppId}`);
    }
    return openUrl(
      `https://apps.apple.com/search?term=${encodeURIComponent(name)}&entity=software`
    );
  }

  // Web: prefer direct store links when we have IDs
  if (androidPackageId) {
    return openUrl(
      `https://play.google.com/store/apps/details?id=${androidPackageId}`
    );
  }
  if (knownIosId) {
    return openUrl(`https://apps.apple.com/app/id${knownIosId}`);
  }
  if (app.url) {
    return openUrl(app.url);
  }
  return openUrl(
    `https://www.google.com/search?q=${encodeURIComponent(`${name} app download`)}`
  );
}
