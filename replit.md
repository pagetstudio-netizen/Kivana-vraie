# kivana-scanner

A React + Vite QR code scanner app (French UI) with Capacitor for Android packaging.

## Stack
- React 19 + Vite
- html5-qrcode — QR scanning
- @capacitor/core + @capacitor/android — Android APK build
- @capacitor/local-notifications — push notifications
- react-icons — UI icons
- localStorage — auth/state persistence (no backend)

## Running locally (web preview)
```bash
npm run dev
```
Runs on port 5000. The Vite dev server is configured with `allowedHosts: true` for Replit's proxy.

## Android build
Requires Android SDK (not available on Replit). Build locally:
```bash
npm run build
npx cap sync android
npx cap open android   # opens Android Studio
```

## Important
- Do **not** modify or delete `android/`, `capacitor.config.json`, or any Capacitor-related config when making UI-only changes.

## User preferences
- Preserve Capacitor/Android configuration when making interface-only changes.
