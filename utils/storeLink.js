import { Linking, Platform } from 'react-native';

export async function openStorePage(app) {
  if (!app) return;
  const name = app.name;

  if (Platform.OS === 'android') {
    if (app.androidPackageId) {
      const market = `market://details?id=${app.androidPackageId}`;
      const web = `https://play.google.com/store/apps/details?id=${app.androidPackageId}`;
      try {
        const ok = await Linking.canOpenURL(market);
        return Linking.openURL(ok ? market : web);
      } catch {
        return Linking.openURL(web);
      }
    }
    const market = `market://search?q=${encodeURIComponent(name)}&c=apps`;
    const web = `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`;
    try {
      const ok = await Linking.canOpenURL(market);
      return Linking.openURL(ok ? market : web);
    } catch {
      return Linking.openURL(web);
    }
  }

  if (Platform.OS === 'ios') {
    if (app.iosAppId) {
      const store = `itms-apps://apps.apple.com/app/id${app.iosAppId}`;
      const web = `https://apps.apple.com/app/id${app.iosAppId}`;
      try {
        const ok = await Linking.canOpenURL(store);
        return Linking.openURL(ok ? store : web);
      } catch {
        return Linking.openURL(web);
      }
    }
    const store = `itms-apps://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software`;
    const web = `https://apps.apple.com/search?term=${encodeURIComponent(name)}`;
    try {
      const ok = await Linking.canOpenURL(store);
      return Linking.openURL(ok ? store : web);
    } catch {
      return Linking.openURL(web);
    }
  }

  if (app.url) Linking.openURL(app.url);
}
