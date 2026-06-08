// Offline fallback when the AI backend is rate-limited or down
export const FALLBACK_HOME = {
  categories: [
    {
      title: 'Trending Now',
      subtitle: 'Apps everyone is downloading',
      apps: [
        { id: 'spotify', name: 'Spotify', category: 'Music', description: 'Stream millions of songs and podcasts.', platforms: ['iOS', 'Android'], pricing: 'Freemium', url: 'https://spotify.com', tagline: 'Music for everyone', colorHue: 120, androidPackageId: 'com.spotify.music', iosAppId: '324684580' },
        { id: 'youtube', name: 'YouTube', category: 'Video', description: 'Watch and share videos worldwide.', platforms: ['iOS', 'Android'], pricing: 'Freemium', url: 'https://youtube.com', tagline: 'Broadcast yourself', colorHue: 0, androidPackageId: 'com.google.android.youtube', iosAppId: '544007664' },
        { id: 'instagram', name: 'Instagram', category: 'Social', description: 'Share photos and stories with friends.', platforms: ['iOS', 'Android'], pricing: 'Free', url: 'https://instagram.com', tagline: 'Capture and share', colorHue: 320, androidPackageId: 'com.instagram.android', iosAppId: '389801252' },
        { id: 'whatsapp', name: 'WhatsApp', category: 'Messaging', description: 'Simple, reliable messaging and calls.', platforms: ['iOS', 'Android'], pricing: 'Free', url: 'https://whatsapp.com', tagline: 'Message privately', colorHue: 140, androidPackageId: 'com.whatsapp', iosAppId: '310633997' },
        { id: 'netflix', name: 'Netflix', category: 'Entertainment', description: 'Watch TV shows and movies.', platforms: ['iOS', 'Android'], pricing: 'Subscription', url: 'https://netflix.com', tagline: 'See what\'s next', colorHue: 0, androidPackageId: 'com.netflix.mediaclient', iosAppId: '363590051' },
      ],
    },
    {
      title: 'AI Tools',
      subtitle: 'Smart assistants and creative AI',
      apps: [
        { id: 'chatgpt', name: 'ChatGPT', category: 'AI', description: 'AI assistant for writing and ideas.', platforms: ['iOS', 'Android', 'Web'], pricing: 'Freemium', url: 'https://chatgpt.com', tagline: 'Ask anything', colorHue: 160, androidPackageId: 'com.openai.chatgpt', iosAppId: '6448311069' },
        { id: 'claude', name: 'Claude', category: 'AI', description: 'Helpful AI for analysis and writing.', platforms: ['iOS', 'Android', 'Web'], pricing: 'Freemium', url: 'https://claude.ai', tagline: 'Think with Claude', colorHue: 30, androidPackageId: 'com.anthropic.claude', iosAppId: '6473753684' },
        { id: 'capcut', name: 'CapCut', category: 'Video', description: 'Easy video editing on your phone.', platforms: ['iOS', 'Android'], pricing: 'Freemium', url: 'https://capcut.com', tagline: 'Edit like a pro', colorHue: 210, androidPackageId: 'com.lemon.lvoverseas', iosAppId: '1500855883' },
        { id: 'canva', name: 'Canva', category: 'Design', description: 'Create graphics and presentations fast.', platforms: ['iOS', 'Android', 'Web'], pricing: 'Freemium', url: 'https://canva.com', tagline: 'Design anything', colorHue: 190, androidPackageId: 'com.canva.editor', iosAppId: '897446215' },
      ],
    },
    {
      title: 'Get Productive',
      subtitle: 'Work smarter every day',
      apps: [
        { id: 'notion', name: 'Notion', category: 'Productivity', description: 'Notes, docs, and project hubs.', platforms: ['iOS', 'Android', 'Web'], pricing: 'Freemium', url: 'https://notion.so', tagline: 'Your workspace', colorHue: 0, androidPackageId: 'notion.id', iosAppId: '1232780281' },
        { id: 'todoist', name: 'Todoist', category: 'Tasks', description: 'Organize tasks and hit your goals.', platforms: ['iOS', 'Android'], pricing: 'Freemium', url: 'https://todoist.com', tagline: 'Do more', colorHue: 0, androidPackageId: 'com.todoist', iosAppId: '572688855' },
        { id: 'gmail', name: 'Gmail', category: 'Email', description: 'Fast, searchable email from Google.', platforms: ['iOS', 'Android', 'Web'], pricing: 'Free', url: 'https://gmail.com', tagline: 'Email made easy', colorHue: 0, androidPackageId: 'com.google.android.gm', iosAppId: '422689480' },
        { id: 'zoom', name: 'Zoom', category: 'Meetings', description: 'Video meetings and team chat.', platforms: ['iOS', 'Android', 'Desktop'], pricing: 'Freemium', url: 'https://zoom.us', tagline: 'Meet anywhere', colorHue: 220, androidPackageId: 'us.zoom.videomeetings', iosAppId: '546505307' },
      ],
    },
  ],
  fallback: true,
};
