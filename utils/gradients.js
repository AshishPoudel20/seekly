function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => Math.round(255 * f(x)).toString(16).padStart(2, '0');
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

export function getAppGradient(app) {
  const hueSeed = (typeof app.colorHue === 'number')
    ? app.colorHue
    : hash(app.name || 'app') % 360;

  const h1 = hueSeed;
  const h2 = (hueSeed + 25) % 360;
  const h3 = (hueSeed + 55) % 360;

  return [
    hslToHex(h1, 75, 35),
    hslToHex(h2, 60, 22),
    hslToHex(h3, 80, 12),
  ];
}

export function getAppAccent(app) {
  const hueSeed = (typeof app.colorHue === 'number')
    ? app.colorHue
    : hash(app.name || 'app') % 360;
  return hslToHex(hueSeed, 80, 55);
}
