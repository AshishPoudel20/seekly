const BACKEND_URL = 'https://found-production-1723.up.railway.app';

async function parseApiError(res) {
  try {
    const data = await res.json();
    const message = data?.error || data?.message || '';
    if (message.includes('rate_limit') || message.includes('Rate limit')) {
      return 'AI service is temporarily out of daily capacity. Try again in about an hour, or use search below.';
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
