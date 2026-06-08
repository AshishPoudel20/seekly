# Seekly — Detail Page Enhancement (Zip 2 of 2)

## What This Adds

Tap any app on home or search → modal now shows:

1. **WHY IT FITS** (only on search results) — existing
2. **ABOUT** — existing
3. **WHAT YOU CAN DO** ✨ NEW
   - 3-4 specific actions tied to your search context
   - e.g., for "edit videos" → CapCut shows "Add transitions and music to your phone clips"
4. **THINGS TO KNOW** ✨ NEW
   - Free vs paid, account requirements, offline support, ads, privacy
   - Honest, concise practical info
5. **COMMON QUESTIONS** ✨ NEW
   - 3 collapsible Q&A items (tap to expand)
   - Real questions like "What's the catch with the free plan?"
6. **AVAILABLE ON** — existing

All AI-generated. Cached so revisiting an app loads instantly.

## 📁 Files

### Backend (1 file — REPLACES, includes home + new endpoint)
| File | Replaces |
|---|---|
| `server.js` | `C:\Users\ashis\find-the-app-backend\server.js` |

### Frontend (3 files)
| File | Location |
|---|---|
| `App.js` | `C:\Users\ashis\Seekly\App.js` (replace) |
| `api.js` | `C:\Users\ashis\Seekly\api.js` (replace) |
| `components/AppDetailModal.js` | replace |
| `components/QuestionItem.js` | NEW |

## Deploy

```
cd C:\Users\ashis\find-the-app-backend
railway up
```

Then in Seekly project:
```
cd C:\Users\ashis\Seekly
npx expo start
```

Reload Expo on your phone, tap any app to see the new sections.

## How It Works

When you tap an app:
1. Modal opens immediately with hero + basic info (instant, no wait)
2. In the background, fetches details from backend (~2-3 seconds first time)
3. Use cases / things to know / questions appear as they arrive
4. After loading once, cached forever — instant next time

## Cost

Each detail fetch = ~1 AI call. Cached per (app + search query) combo. So if 100 users tap Spotify after searching "music", that's 1 AI call total (cached for everyone).

## When Ready

Rebuild APK with:
```
set EAS_NO_VCS=1
eas build --profile preview --platform android
```
