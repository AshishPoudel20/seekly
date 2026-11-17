// Railway (production) — redeploy backend after server.js changes
const PROD_BACKEND = 'https://found-production-1723.up.railway.app';

// Local backend — set EXPO_PUBLIC_DEV_BACKEND to your PC LAN IP for phone testing
// (see ARCHITECTURE.md). Defaults to localhost for simulators/web.
const DEV_BACKEND =
  process.env.EXPO_PUBLIC_DEV_BACKEND || 'http://localhost:3000';

export const BACKEND_URL = __DEV__ ? DEV_BACKEND : PROD_BACKEND;

let rateLimitedUntil = 0;

export function isAiRateLimited() {
  return Date.now() < rateLimitedUntil;
}

function markRateLimited(message = '') {
  const match = message.match(/try again in (\d+)m/i);
  const minutes = match ? Number(match[1]) : 60;
  rateLimitedUntil = Date.now() + minutes * 60 * 1000;
}

async function parseApiError(res) {
  try {
    const data = await res.json();
    const message = data?.error || data?.message || '';
    if (message.includes('rate_limit') || message.includes('Rate limit')) {
      markRateLimited(message);
      return 'AI is temporarily out of capacity. Try again in about an hour.';
    }
    if (
      message.includes('invalid JSON') ||
      message.includes('Failed to validate JSON') ||
      message.includes('Failed to generate JSON') ||
      message.includes('json_validate_failed')
    ) {
      return 'AI returned invalid JSON. Please try a shorter search.';
    }
    if (message) return message;
  } catch {
    // ignore JSON parse errors
  }
  return `Server error: ${res.status}`;
}

export async function searchApps(query) {
  const res = await fetch(`${BACKEND_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json();
}

export async function fetchHome() {
  const res = await fetch(`${BACKEND_URL}/home`);
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json();
}

export async function fetchAppDetails(app, query = null) {
  const res = await fetch(`${BACKEND_URL}/app-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app, query }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json();
}
