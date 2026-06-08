export function getPlatforms(app) {
  const raw = app?.platforms;
  if (Array.isArray(raw)) {
    return raw.filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(/[,·|]/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}
