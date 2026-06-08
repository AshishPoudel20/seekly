function normalizeKey(value) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Verified store IDs for popular apps (fixes AI guesses + missing IDs)
const KNOWN_APPS = {
  spotify: { androidPackageId: 'com.spotify.music', iosAppId: '324684580' },
  youtube: { androidPackageId: 'com.google.android.youtube', iosAppId: '544007664' },
  instagram: { androidPackageId: 'com.instagram.android', iosAppId: '389801252' },
  whatsapp: { androidPackageId: 'com.whatsapp', iosAppId: '310633997' },
  whatsappmessenger: { androidPackageId: 'com.whatsapp', iosAppId: '310633997' },
  netflix: { androidPackageId: 'com.netflix.mediaclient', iosAppId: '363590051' },
  canva: { androidPackageId: 'com.canva.editor', iosAppId: '897446215' },
  duolingo: { androidPackageId: 'com.duolingo', iosAppId: '570060128' },
  snapchat: { androidPackageId: 'com.snapchat.android', iosAppId: '447188370' },
  facebook: { androidPackageId: 'com.facebook.katana', iosAppId: '284882215' },
  linkedin: { androidPackageId: 'com.linkedin.android', iosAppId: '288429040' },
  tiktok: { androidPackageId: 'com.zhiliaoapp.musically', iosAppId: '835599320' },
  pinterest: { androidPackageId: 'com.pinterest', iosAppId: '429047995' },
  discord: { androidPackageId: 'com.discord', iosAppId: '985746746' },
  reddit: { androidPackageId: 'com.reddit.frontpage', iosAppId: '1064216828' },
  lightroom: { androidPackageId: 'com.adobe.lrmobile', iosAppId: '804177739' },
  adobelightroom: { androidPackageId: 'com.adobe.lrmobile', iosAppId: '804177739' },
  airbnb: { androidPackageId: 'com.airbnb.android', iosAppId: '401626263' },
  uber: { androidPackageId: 'com.ubercab', iosAppId: '368677368' },
  ubereats: { androidPackageId: 'com.ubereats', iosAppId: '1058959277' },
  ubereatsfooddelivery: { androidPackageId: 'com.ubereats', iosAppId: '1058959277' },
  zomato: { androidPackageId: 'com.application.zomato', iosAppId: '434613896' },
  swiggy: { androidPackageId: 'in.swiggy.android', iosAppId: '989620539' },
  disney: { androidPackageId: 'com.disney.disneyplus', iosAppId: '1446075923' },
  disneyplus: { androidPackageId: 'com.disney.disneyplus', iosAppId: '1446075923' },
  headspace: { androidPackageId: 'com.headspace.android', iosAppId: '493619333' },
  calm: { androidPackageId: 'com.calm.android', iosAppId: '571800810' },
  myfitnesspal: { androidPackageId: 'com.myfitnesspal.android', iosAppId: '341232718' },
  strava: { androidPackageId: 'com.strava', iosAppId: '426826309' },
  fitbit: { androidPackageId: 'com.fitbit.FitbitMobile', iosAppId: '462638897' },
  nike: { androidPackageId: 'com.nike.plusgps', iosAppId: '387771637' },
  nikerunclub: { androidPackageId: 'com.nike.plusgps', iosAppId: '387771637' },
  googlemaps: { androidPackageId: 'com.google.android.apps.maps', iosAppId: '585027354' },
  maps: { androidPackageId: 'com.google.android.apps.maps', iosAppId: '585027354' },
  gmail: { androidPackageId: 'com.google.android.gm', iosAppId: '422689480' },
  outlook: { androidPackageId: 'com.microsoft.office.outlook', iosAppId: '951937596' },
  zoom: { androidPackageId: 'us.zoom.videomeetings', iosAppId: '546505307' },
  notion: { androidPackageId: 'notion.id', iosAppId: '1232780281' },
  todoist: { androidPackageId: 'com.todoist', iosAppId: '572688855' },
  trello: { androidPackageId: 'com.trello', iosAppId: '461504587' },
  dropbox: { androidPackageId: 'com.dropbox.android', iosAppId: '327630330' },
  capcut: { androidPackageId: 'com.lemon.lvoverseas', iosAppId: '1500855883' },
  capcutvideoeditor: { androidPackageId: 'com.lemon.lvoverseas', iosAppId: '1500855883' },
  chatgpt: { androidPackageId: 'com.openai.chatgpt', iosAppId: '6448311069' },
  claude: { androidPackageId: 'com.anthropic.claude', iosAppId: '6473753684' },
  copilot: { androidPackageId: 'com.microsoft.copilot', iosAppId: '6472538445' },
  microsoftcopilot: { androidPackageId: 'com.microsoft.copilot', iosAppId: '6472538445' },
  gemini: { androidPackageId: 'com.google.android.apps.bard', iosAppId: '6477489729' },
  googlegemini: { androidPackageId: 'com.google.android.apps.bard', iosAppId: '6477489729' },
  coinbase: { androidPackageId: 'com.coinbase.android', iosAppId: '886427730' },
  robinhood: { androidPackageId: 'com.robinhood.android', iosAppId: '938003185' },
  paypal: { androidPackageId: 'com.paypal.android.p2pmobile', iosAppId: '283646709' },
  venmo: { androidPackageId: 'com.venmo', iosAppId: '351727428' },
  telegram: { androidPackageId: 'org.telegram.messenger', iosAppId: '686449807' },
  signal: { androidPackageId: 'org.thoughtcrime.securesms', iosAppId: '874139669' },
  slack: { androidPackageId: 'com.Slack', iosAppId: '618783545' },
  spotifyforpodcasters: { androidPackageId: 'com.spotify.s4a', iosAppId: '1056182234' },
  amazon: { androidPackageId: 'com.amazon.mShop.android.shopping', iosAppId: '297606951' },
  primevideo: { androidPackageId: 'com.amazon.avod.thirdpartyclient', iosAppId: '545519333' },
  hulu: { androidPackageId: 'com.hulu.plus', iosAppId: '376510438' },
  twitch: { androidPackageId: 'tv.twitch.android.app', iosAppId: '460177396' },
  shazam: { androidPackageId: 'com.shazam.android', iosAppId: '284993459' },
  soundcloud: { androidPackageId: 'com.soundcloud.android', iosAppId: '336353151' },
  audible: { androidPackageId: 'com.audible.application', iosAppId: '379693831' },
  kindle: { androidPackageId: 'com.amazon.kindle', iosAppId: '302584613' },
  waze: { androidPackageId: 'com.waze', iosAppId: '323229106' },
  lyft: { androidPackageId: 'me.lyft.android', iosAppId: '529379082' },
  googlephotos: { androidPackageId: 'com.google.android.apps.photos', iosAppId: '962194608' },
  googlechrome: { androidPackageId: 'com.android.chrome', iosAppId: '535886823' },
  chrome: { androidPackageId: 'com.android.chrome', iosAppId: '535886823' },
  googledrive: { androidPackageId: 'com.google.android.apps.docs', iosAppId: '507874739' },
  googledocs: { androidPackageId: 'com.google.android.apps.docs.editors.docs', iosAppId: '842842640' },
  googlesheets: { androidPackageId: 'com.google.android.apps.docs.editors.sheets', iosAppId: '842849113' },
  microsoftteams: { androidPackageId: 'com.microsoft.teams', iosAppId: '1113153706' },
  teams: { androidPackageId: 'com.microsoft.teams', iosAppId: '1113153706' },
  snapseed: { androidPackageId: 'com.niksoftware.snapseed', iosAppId: '439438619' },
  vsco: { androidPackageId: 'com.vsco.cam', iosAppId: '588013838' },
  picsart: { androidPackageId: 'com.picsart.studio', iosAppId: '587366035' },
  inshot: { androidPackageId: 'com.camerasideas.instashot', iosAppId: '997362197' },
  kinemaster: { androidPackageId: 'com.nexstreaming.app.kinemasterfree', iosAppId: '1609369950' },
  spotifyandroid: { androidPackageId: 'com.spotify.music', iosAppId: '324684580' },
};

export function lookupKnownApp(app) {
  if (!app) return null;

  const keys = [
    normalizeKey(app.id),
    normalizeKey(app.name),
    normalizeKey(app.name?.split(':')[0]),
    normalizeKey(app.name?.split(' ')[0]),
  ].filter(Boolean);

  for (const key of keys) {
    if (KNOWN_APPS[key]) return KNOWN_APPS[key];
  }

  return null;
}

export function resolveStoreIds(app) {
  const known = lookupKnownApp(app);
  return {
    androidPackageId: app?.androidPackageId || known?.androidPackageId || null,
    iosAppId: app?.iosAppId ? String(app.iosAppId) : known?.iosAppId || null,
  };
}
