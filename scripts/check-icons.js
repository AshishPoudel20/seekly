/**
 * Verify icons + AU store listings.
 * 1) Tries GET /home
 * 2) If /home fails, POSTs fallback apps to /debug/enrich
 * Usage: node scripts/check-icons.js [backendUrl]
 */
const path = require('path');
const BACKEND = process.argv[2] || 'http://127.0.0.1:3000';

// Load offline home list without ESM (duplicate minimal seed if require fails)
function loadFallbackApps() {
  try {
    // fallbackHome is ESM — re-declare a verified seed for the checker
  } catch {}
  return [
    { id: 'spotify', name: 'Spotify', url: 'https://spotify.com', androidPackageId: 'com.spotify.music', iosAppId: '324684580' },
    { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', androidPackageId: 'com.google.android.youtube', iosAppId: '544007664' },
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', androidPackageId: 'com.instagram.android', iosAppId: '389801252' },
    { id: 'whatsapp', name: 'WhatsApp', url: 'https://whatsapp.com', androidPackageId: 'com.whatsapp', iosAppId: '310633997' },
    { id: 'netflix', name: 'Netflix', url: 'https://netflix.com', androidPackageId: 'com.netflix.mediaclient', iosAppId: '363590051' },
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', androidPackageId: 'com.openai.chatgpt', iosAppId: '6448311069' },
    { id: 'claude', name: 'Claude', url: 'https://claude.ai', androidPackageId: 'com.anthropic.claude', iosAppId: '6473753684' },
    { id: 'capcut', name: 'CapCut', url: 'https://capcut.com', androidPackageId: 'com.lemon.lvoverseas', iosAppId: '1500855883' },
    { id: 'canva', name: 'Canva', url: 'https://canva.com', androidPackageId: 'com.canva.editor', iosAppId: '897446215' },
    { id: 'notion', name: 'Notion', url: 'https://notion.so', androidPackageId: 'notion.id', iosAppId: '1232780281' },
    { id: 'todoist', name: 'Todoist', url: 'https://todoist.com', androidPackageId: 'com.todoist', iosAppId: '572688855' },
    { id: 'gmail', name: 'Gmail', url: 'https://gmail.com', androidPackageId: 'com.google.android.gm', iosAppId: '422689480' },
    { id: 'zoom', name: 'Zoom', url: 'https://zoom.us', androidPackageId: 'us.zoom.videomeetings', iosAppId: '546505307' },
    { id: 'duolingo', name: 'Duolingo', url: 'https://duolingo.com', androidPackageId: 'com.duolingo', iosAppId: '570060128' },
    { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com', androidPackageId: 'com.zhiliaoapp.musically', iosAppId: '835599320' },
  ];
}

async function headOrGet(url) {
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-AU,en;q=0.9',
      },
    });
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept-Language': 'en-AU,en;q=0.9',
          Range: 'bytes=0-2047',
        },
      });
    }
    const type = res.headers.get('content-type') || '';
    return { status: res.status, type, ok: res.ok };
  } catch (e) {
    return { status: 0, type: '', ok: false, error: e.message };
  }
}

async function checkPlay(packageId) {
  if (!packageId) return { ok: false, reason: 'no package' };
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}&gl=AU&hl=en_AU`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-AU,en;q=0.9',
      },
      redirect: 'follow',
    });
    const html = await res.text();
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const hasTitle = !!titleMatch;
    const unavailable = /item not found|not available|doesn't exist/i.test(html) && !hasTitle;
    return {
      ok: res.ok && hasTitle && !unavailable,
      status: res.status,
      title: titleMatch?.[1] || null,
      url,
    };
  } catch (e) {
    return { ok: false, error: e.message, url };
  }
}

async function checkAppStore(iosAppId) {
  if (!iosAppId) return { ok: false, reason: 'no ios id' };
  const url = `https://apps.apple.com/au/app/id${iosAppId}`;
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${encodeURIComponent(iosAppId)}&country=au`
    );
    if (!res.ok) return { ok: false, status: res.status, url };
    const data = await res.json();
    const item = data.results?.[0];
    return {
      ok: !!item?.trackId,
      title: item?.trackName || null,
      url,
    };
  } catch (e) {
    return { ok: false, error: e.message, url };
  }
}

async function loadApps() {
  console.log(`Trying ${BACKEND}/home ...`);
  try {
    const homeRes = await fetch(`${BACKEND}/home`);
    if (homeRes.ok) {
      const home = await homeRes.json();
      const apps = [];
      const seen = new Set();
      for (const cat of home.categories || []) {
        for (const app of cat.apps || []) {
          const key = `${app.name}::${app.androidPackageId || ''}::${app.iosAppId || ''}`;
          if (seen.has(key)) continue;
          seen.add(key);
          apps.push(app);
        }
      }
      if (apps.length) {
        console.log(`Loaded ${apps.length} apps from /home`);
        return { apps, source: 'home' };
      }
    } else {
      console.log(`/home failed: ${homeRes.status}`);
    }
  } catch (e) {
    console.log(`/home error: ${e.message}`);
  }

  console.log('Falling back to /debug/enrich with seed apps...');
  const seed = loadFallbackApps();
  const headers = { 'Content-Type': 'application/json' };
  // Backend requires x-debug-token when DEBUG_TOKEN is set; 404 if unset.
  if (process.env.DEBUG_TOKEN) headers['x-debug-token'] = process.env.DEBUG_TOKEN;
  const enrichRes = await fetch(`${BACKEND}/debug/enrich`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ apps: seed }),
  });
  if (!enrichRes.ok) {
    throw new Error(`/debug/enrich failed: ${enrichRes.status} ${await enrichRes.text()}`);
  }
  const data = await enrichRes.json();
  console.log(`Enriched ${data.apps.length} seed apps`);
  return { apps: data.apps, source: 'debug/enrich' };
}

(async () => {
  const { apps, source } = await loadApps();
  console.log(`Source: ${source}\n`);

  const rows = [];
  for (const app of apps) {
    const iconCheck = app.iconUrl
      ? await headOrGet(app.iconUrl)
      : { ok: false, status: 0, type: '', reason: 'no iconUrl' };
    const iconOk =
      iconCheck.ok &&
      (/image\//i.test(iconCheck.type || '') || !iconCheck.type);

    const play = await checkPlay(app.androidPackageId);
    const ios = await checkAppStore(app.iosAppId);

    const row = {
      name: app.name,
      androidPackageId: app.androidPackageId || '',
      iosAppId: app.iosAppId || '',
      iconUrl: app.iconUrl || '',
      iconOk: !!iconOk,
      iconStatus: iconCheck.status,
      iconType: iconCheck.type,
      playOk: !!play.ok,
      iosOk: !!ios.ok,
      playUrl: play.url || '',
      iosUrl: ios.url || '',
      playTitle: play.title || '',
      iosTitle: ios.title || '',
      fix: [],
    };

    if (row.iconOk && /mzstatic|itunes/i.test(row.iconUrl)) row.fix.push('itunes-icon');
    if (row.iconOk && /googleusercontent|ggpht|play-lh/i.test(row.iconUrl)) row.fix.push('play-og-image');
    if (row.playOk) row.fix.push('play-au-ok');
    if (row.iosOk) row.fix.push('itunes-au-ok');
    if (!row.iconOk) row.fix.push('icon-still-broken');

    rows.push(row);

    console.log(
      [
        row.iconOk ? 'ICON✓' : 'ICON✗',
        row.playOk ? 'PLAY✓' : 'PLAY✗',
        row.iosOk ? 'IOS✓' : 'IOS✗',
        row.name,
        `| pkg=${row.androidPackageId || '-'}`,
        `| ios=${row.iosAppId || '-'}`,
        `| icon=${row.iconUrl ? row.iconUrl.slice(0, 70) : 'NONE'}`,
      ].join(' ')
    );
  }

  const iconFail = rows.filter((r) => !r.iconOk);
  const playFail = rows.filter((r) => r.androidPackageId && !r.playOk);
  const iosFail = rows.filter((r) => r.iosAppId && !r.iosOk);
  const bothStoreFail = rows.filter((r) => !r.playOk && !r.iosOk);

  console.log('\n========== SUMMARY ==========');
  console.log(`Total apps: ${rows.length}`);
  console.log(`Icons OK: ${rows.filter((r) => r.iconOk).length}`);
  console.log(`Icons FAIL: ${iconFail.length}`);
  console.log(`Play FAIL (has package): ${playFail.length}`);
  console.log(`iOS FAIL (has id): ${iosFail.length}`);
  console.log(`No working store: ${bothStoreFail.length}`);

  const worst = [...rows]
    .sort((a, b) => Number(a.iconOk) - Number(b.iconOk) || Number(a.playOk + a.iosOk) - Number(b.playOk + b.iosOk))
    .slice(0, 5);

  console.log('\n========== WORST 5 ==========');
  for (const w of worst) {
    console.log(
      JSON.stringify(
        {
          name: w.name,
          fix: w.fix,
          iconOk: w.iconOk,
          playOk: w.playOk,
          iosOk: w.iosOk,
          androidPackageId: w.androidPackageId,
          iosAppId: w.iosAppId,
          iconUrl: w.iconUrl,
          playUrl: w.playUrl,
          iosUrl: w.iosUrl,
          playResolves200: w.playOk,
          iosResolves: w.iosOk,
        },
        null,
        2
      )
    );
  }

  console.log('\n========== STILL BROKEN ==========');
  const broken = rows.filter((r) => !r.iconOk || (!r.playOk && !r.iosOk));
  if (broken.length === 0) {
    console.log('(none)');
  } else {
    for (const b of broken) {
      const why = [];
      if (!b.iconOk) why.push(`icon missing/unreachable (status=${b.iconStatus}, type=${b.iconType || 'n/a'})`);
      if (!b.playOk && !b.androidPackageId) why.push('no android package after AU verify');
      if (b.androidPackageId && !b.playOk) why.push('Play AU listing failed');
      if (!b.iosOk && !b.iosAppId) why.push('no ios id');
      if (b.iosAppId && !b.iosOk) why.push('iTunes AU lookup failed');
      console.log(`- ${b.name}: ${why.join('; ')}`);
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
