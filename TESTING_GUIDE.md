# Android App Testing Guide

This guide explains how to test your Keep Pushing Android app before publishing to the Play Store.

## Prerequisites

- Android Studio installed (download from [developer.android.com/studio](https://developer.android.com/studio))
- Android device with USB debugging enabled, OR
- Android emulator configured in Android Studio

## Opening the Project

1. Open Android Studio
2. Click **"Open an existing project"**
3. Navigate to: `/Users/bopr/Documents/keeppushing/android`
4. Click **"Open"**

Android Studio will sync the Gradle files automatically (may take a few minutes).

## Testing on an Emulator

### Create an Emulator (First Time)

1. In Android Studio, go to **Tools** → **Device Manager**
2. Click **"Create Device"**
3. Select a device (e.g., Pixel 5, Pixel 7)
4. Click **"Next"**
5. Download a system image (recommended: API 33 or higher for Android 13+)
6. Click **"Next"** → **"Finish"**

### Run on Emulator

1. Select your emulator from the device dropdown (top toolbar)
2. Click the green **Play** button (▶️) or press **Shift+F10**
3. Wait for the emulator to boot and the app to install
4. The app should launch automatically

### Testing Checklist (Emulator)

- ✅ App launches successfully
- ✅ UI displays correctly
- ✅ Can set start date and challenge parameters
- ✅ Can complete/uncomplete days (toggle checkmarks)
- ✅ Local storage persists data (close and reopen app)
- ✅ Dashboard shows correct stats
- ⚠️ **Push notifications won't work without google-services.json** (see FIREBASE_SETUP.md)
- ⚠️ **Authentication may not work in emulator** (Google Sign-In needs Play Services)

## Testing on a Physical Device

Physical device testing is recommended for:
- Push notifications
- Google authentication
- Performance testing
- Real-world user experience

### Enable USB Debugging on Android Device

1. Go to **Settings** → **About Phone**
2. Tap **"Build Number"** 7 times to enable Developer Options
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **"USB Debugging"**
5. Connect device to computer via USB

### Run on Physical Device

1. Connect your Android device via USB
2. On first connection, your device will prompt to **"Allow USB debugging"** - tap **Allow**
3. In Android Studio, your device should appear in the device dropdown
4. Select your device from the dropdown
5. Click the green **Play** button (▶️)
6. The app will install and launch on your device

### Testing Checklist (Physical Device)

- ✅ App launches successfully
- ✅ UI displays correctly and is responsive
- ✅ Can set start date and challenge parameters
- ✅ Can complete/uncomplete days
- ✅ Local storage persists data
- ✅ Dashboard shows correct stats
- ✅ Status bar appears correctly (dark theme)
- ✅ Splash screen displays on launch
- ✅ Push notifications work (after Firebase setup)
- ✅ Google Sign-In works (if configured)
- ✅ App handles screen rotation
- ✅ Back button navigation works
- ✅ Share to LinkedIn works
- ✅ App performs smoothly (no lag)

## Push Notification Testing

After completing Firebase setup (see FIREBASE_SETUP.md):

1. **Enable Notifications in App**:
   - Open the app
   - Tap the bell icon
   - Grant notification permission when prompted
   - Set a notification time

2. **Check FCM Token**:
   - Open Android Studio Logcat
   - Filter for "FCM token"
   - Copy the token that appears

3. **Send Test Notification from Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to **Cloud Messaging**
   - Click **"Send your first message"**
   - Enter notification title and text
   - Click **"Send test message"**
   - Paste your FCM token
   - Click **"Test"**

4. **Verify Notification Received**:
   - Notification should appear on your device
   - Tapping it should open the app

## Building Debug APK for Testing

To share the app with testers without Play Store:

```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

You can install this on any Android device:
```bash
adb install app-debug.apk
```

## Common Issues

### "Unable to locate adb"
- Make sure Android SDK is installed
- Set ANDROID_HOME environment variable

### "Gradle build failed"
- Click **File** → **Invalidate Caches / Restart**
- Clean and rebuild: **Build** → **Clean Project** → **Build** → **Rebuild Project**

### "App crashes on launch"
- Check Android Studio Logcat for error messages
- Ensure you ran `npm run build` and `npx cap sync android` after code changes

### "Push notifications not working"
- Verify google-services.json is in `android/app/`
- Check Firebase project settings
- Ensure POST_NOTIFICATIONS permission is granted (Android 13+)
- Verify FCM token is being generated (check Logcat)

### "Google Sign-In not working"
- Add SHA-1 certificate fingerprint to Firebase
- Get debug SHA-1: `cd android && ./gradlew signingReport`
- Add it to Firebase Console → Project Settings → Your App

### "Device not showing in Android Studio"
- Reconnect USB cable
- Disable and re-enable USB debugging
- Try different USB cable or port
- Install device drivers (Windows)

## Quick Test Script

Use this command-line workflow for rapid testing:

```bash
# 1. Make code changes
# 2. Build and sync
npm run build && npx cap sync android

# 3. Open in Android Studio (or run from command line)
npx cap open android

# Or build and install via command line:
cd android
./gradlew installDebug
adb shell am start -n com.keeppushing.app/.MainActivity
```

## Performance Testing

Monitor app performance:

1. In Android Studio, click **View** → **Tool Windows** → **Profiler**
2. Select your running app
3. Monitor CPU, Memory, Network, and Energy usage
4. Ensure no memory leaks or excessive CPU usage

## Next Steps After Testing

Once testing is complete:
1. ✅ Verify all features work as expected
2. ✅ Test on multiple devices/Android versions if possible
3. ✅ Fix any bugs or issues discovered
4. ✅ Proceed to release build setup (see next section)

## Useful Commands

```bash
# View Android logs
npx cap run android

# Open Android Studio
npx cap open android

# Check connected devices
adb devices

# Install APK manually
adb install path/to/app.apk

# Uninstall app
adb uninstall com.keeppushing.app

# View app logs
adb logcat | grep "Keep Pushing"
```

## Debugging Tips

- Use `console.log()` in your code - outputs appear in Logcat
- Filter Logcat by "chromium" to see web console logs
- Use Android Studio debugger for Java/Kotlin code
- Enable **"Show layout bounds"** in Developer Options to debug UI
- Use **"Inspect Layout"** in Android Studio for UI debugging
