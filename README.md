# Seekly 🟣

*The app you need, for anything you do.*

## Rebranded from FindFlix

Complete rebuild with:
- 🟣 **Tyrian purple** aesthetic (imperial, refined)
- 📱 **Simpler layout** — hero card + vertical list of alternatives
- 💬 **Contextual reasons** inside each card (AI explains why it fits YOUR search)
- ✨ **Fraunces** serif for impact + **Inter** sans for UI

## 📁 What to Do

### Option A: Full Replace (Recommended)
1. Unzip `Seekly.zip`
2. **Rename your folder** `C:\Users\ashis\FindTheApp` → `C:\Users\ashis\Seekly-old` (keep as backup)
3. Move the new `Seekly` folder to `C:\Users\ashis\Seekly`
4. Install dependencies:
   ```
   cd C:\Users\ashis\Seekly
   npm install
   ```
5. Backend replacement:
   - Copy `server.js` from the Seekly folder
   - Paste into `C:\Users\ashis\find-the-app-backend\` (replace existing)
   - Railway will auto-redeploy when you push the update with:
     ```
     cd C:\Users\ashis\find-the-app-backend
     railway up
     ```

### Option B: Keep Existing Folder
1. Copy all files from the zip into your existing `C:\Users\ashis\FindTheApp` folder
2. Let it overwrite everything
3. `npm install`
4. Update backend and redeploy to Railway

### Test
```
npx expo start
```

### Build new APK
```
set EAS_NO_VCS=1
eas build --profile preview --platform android
```

The app name in the APK will now be **Seekly** with the new bundle ID `com.seekly.app`.

## 📁 Structure

```
Seekly/
├── App.js
├── theme.js                  ← Tyrian purple palette
├── api.js                    ← Railway URL already set
├── server.js                 ← For the backend folder
└── components/
    ├── SplashScreen.js       ← New "seekly" brand intro
    ├── TopBar.js             ← Seekly logo + search
    ├── HeroSpotlight.js      ← Top pick hero
    ├── AppListItem.js        ← Flat list card w/ contextual reason
    ├── AppDetailModal.js     ← Tap-to-expand detail
    ├── LoadingOverlay.js     ← "SEEKING..." loader
    └── PosterArt.js          ← Animated poster art
```
