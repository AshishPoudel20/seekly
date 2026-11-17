import { FALLBACK_HOME } from './fallbackHome';

function scoreApp(app, words) {
  const haystack = `${app.name} ${app.category} ${app.description} ${app.tagline || ''}`.toLowerCase();
  let score = 0;
  for (const word of words) {
    if (word.length < 3) continue;
    if (app.name.toLowerCase().includes(word)) score += 8;
    if (app.category.toLowerCase().includes(word)) score += 5;
    if (haystack.includes(word)) score += 2;
  }
  return score;
}

export function offlineSearch(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const allApps = FALLBACK_HOME.categories.flatMap((c) => c.apps || []);
  const unique = [];
  const seen = new Set();

  for (const app of allApps) {
    const key = app.id || app.name;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ app, score: scoreApp(app, words) });
  }

  const ranked = unique
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.app);

  const picks = ranked.length > 0 ? ranked : allApps.slice(0, 6);

  return {
    contextLine: 'Offline picks',
    featured: picks[0] || null,
    apps: picks.slice(1, 7),
    offline: true,
  };
}
