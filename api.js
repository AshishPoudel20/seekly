// Seekly backend — live on Railway
const BACKEND_URL = 'https://found-production-1723.up.railway.app';

export async function searchApps(query) {
  const res = await fetch(`${BACKEND_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
