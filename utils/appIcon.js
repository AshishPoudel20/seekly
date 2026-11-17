import { lookupKnownApp } from './knownApps';

const itunesCache = new Map();

export async function fetchItunesArtwork(iosAppId, name = null) {
  const id = String(iosAppId || '').trim();
  const cacheKey = `${id}:${(name || '').toLowerCase()}`;
  if (itunesCache.has(cacheKey)) return itunesCache.get(cacheKey);

  try {
    if (id) {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=au`
      );
      if (res.ok) {
        const data = await res.json();
        const item = data.results?.[0];
        const raw = item?.artworkUrl512 || item?.artworkUrl100 || null;
        const hd = raw ? raw.replace(/100x100bb/, '512x512bb') : null;
        if (hd) {
          itunesCache.set(cacheKey, hd);
          return hd;
        }
      }
    }

    if (name) {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software&country=au&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        const key = name.trim().toLowerCase();
        const exact = results.find((r) => (r.trackName || '').trim().toLowerCase() === key);
        const item = exact || results[0];
        const raw = item?.artworkUrl512 || item?.artworkUrl100 || null;
        const hd = raw ? raw.replace(/100x100bb/, '512x512bb') : null;
        itunesCache.set(cacheKey, hd);
        return hd;
      }
    }
  } catch {
    // ignore
  }

  itunesCache.set(cacheKey, null);
  return null;
}

export function getClearbitIconUrl(app) {
  if (!app?.url) return null;
  try {
    const domain = new URL(app.url).hostname.replace(/^www\./, '');
    if (!domain) return null;
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
}

/**
 * Ordered icon candidates:
 * 1) backend iconUrl
 * 2) iTunes by iosAppId (AU)
 * 3) Clearbit by website domain
 */
export async function buildAppIconSources(app) {
  if (!app) return [];

  const labeled = [];
  const add = (url, source) => {
    if (url && !labeled.some((x) => x.url === url)) {
      labeled.push({ url, source });
    }
  };

  add(app.iconUrl, 'backend');

  const known = lookupKnownApp(app);
  const iosAppId = app.iosAppId || known?.iosAppId;
  add(await fetchItunesArtwork(iosAppId, app.name), 'itunes');

  add(getClearbitIconUrl(app), 'clearbit');

  return labeled;
}
