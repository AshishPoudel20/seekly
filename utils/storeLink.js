import { Linking, Platform } from 'react-native';
import { resolveStoreIds } from './knownApps';

const iosLookupCache = new Map();

function normalizeName(name) {
  return (name || '').trim().toLowerCase();
}

function playDetailsUrl(packageId) {
  return `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}&gl=AU&hl=en_AU`;
}

function playSearchUrl(name) {
  return `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps&gl=AU&hl=en_AU`;
}

function appStoreUrl(iosAppId) {
  return `https://apps.apple.com/au/app/id${iosAppId}`;
}

async function lookupIosAppId(appName, bundleIdHint = null) {
  const key = `${normalizeName(appName)}::${bundleIdHint || ''}`;
  if (!normalizeName(appName) && !bundleIdHint) return null;
  if (iosLookupCache.has(key)) return iosLookupCache.get(key);

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&entity=software&country=au&limit=10`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const results = data.results || [];
    const nameKey = normalizeName(appName);

    let match = null;
    if (bundleIdHint) {
      match = results.find((item) => item.bundleId === bundleIdHint);
    }
    if (!match) {
      match = results.find((item) => normalizeName(item.trackName) === nameKey);
    }
    if (!match) match = results[0];

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
  // Prefer IDs already verified/enriched by the backend when present
  const resolved = resolveStoreIds(app);
  const androidPackageId = app.androidPackageId || resolved.androidPackageId;
  let iosAppId = app.iosAppId || resolved.iosAppId;

  if (Platform.OS === 'android') {
    if (androidPackageId) {
      return openUrl(playDetailsUrl(androidPackageId));
    }
    // Prefer AU Play search over a broken detail page
    return openUrl(playSearchUrl(name));
  }

  if (Platform.OS === 'ios') {
    if (!iosAppId) {
      iosAppId = await lookupIosAppId(name);
    }
    if (iosAppId) {
      return openUrl(appStoreUrl(iosAppId));
    }
    return openUrl(
      `https://apps.apple.com/au/search?term=${encodeURIComponent(name)}`
    );
  }

  // Web: prefer AU store links
  if (app.playStoreUrl) return openUrl(app.playStoreUrl);
  if (androidPackageId) return openUrl(playDetailsUrl(androidPackageId));
  if (app.appStoreUrl) return openUrl(app.appStoreUrl);
  if (iosAppId) return openUrl(appStoreUrl(iosAppId));
  if (!iosAppId) {
    iosAppId = await lookupIosAppId(name);
    if (iosAppId) return openUrl(appStoreUrl(iosAppId));
  }
  if (app.url) return openUrl(app.url);
  return openUrl(playSearchUrl(name));
}
