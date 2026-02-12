# Firebase Cloud Messaging (FCM) Setup Guide

This guide will help you set up Firebase Cloud Messaging for push notifications in your Keep Pushing app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or select an existing project
3. Enter project name: `Keep Pushing` (or your preference)
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (optional) or configure it
6. Click **"Create project"**

## Step 2: Add Android App to Firebase

1. In the Firebase Console, click the **Android icon** to add an Android app
2. Enter Android package name: `com.keeppushing.app` 
   - **IMPORTANT**: This MUST match the app ID in `capacitor.config.ts`
3. (Optional) Add app nickname: "Keep Pushing Android"
4. (Optional) Add SHA-1 signing certificate (can be added later)
5. Click **"Register app"**

## Step 3: Download google-services.json

1. Click **"Download google-services.json"**
2. Move the downloaded file to: `android/app/google-services.json`
   
   ```bash
   mv ~/Downloads/google-services.json android/app/google-services.json
   ```

3. The file should be in the `android/app/` directory, NOT the root directory

## Step 4: Verify Configuration

The gradle files are already configured to use Firebase:

- ✅ `android/build.gradle` - Has google-services plugin classpath
- ✅ `android/app/build.gradle` - Has Firebase dependencies and applies plugin when google-services.json exists
- ✅ `.gitignore` - Excludes google-services.json from version control

## Step 5: Test the Setup

After adding `google-services.json`, rebuild the app:

```bash
npm run build
npx cap sync android
npx cap open android
```

In Android Studio, look for this in the build output:
```
✓ google-services.json found, Push Notifications enabled
```

## Step 6: Enable Firebase Cloud Messaging API

1. In Firebase Console, go to **Project Settings** → **Cloud Messaging**
2. Under **Cloud Messaging API (Legacy)**, note if it's enabled
3. If using FCMv1, you'll need to enable the **Cloud Messaging API** in Google Cloud Console:
   - Click the link to Google Cloud Console
   - Enable "Firebase Cloud Messaging API"

## Server-Side Setup (For Sending Notifications)

To send push notifications from your backend, you'll need:

### Option 1: Firebase Admin SDK (Recommended)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file securely (DO NOT commit to git)
4. Use Firebase Admin SDK in your backend:

```javascript
// Example: Sending a notification
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert('path/to/serviceAccountKey.json')
});

await admin.messaging().send({
  token: deviceToken, // FCM token from device
  notification: {
    title: 'Day 5 of 30',
    body: 'Time for your push-up workout! 💪'
  }
});
```

### Option 2: HTTP v1 API

Use the Firebase Cloud Messaging HTTP v1 API with your service account credentials.

## Storing FCM Tokens

When users enable notifications in the app:

1. The app will request notification permission
2. If granted, the app receives an FCM token
3. Send this token to your backend API
4. Store it in your database associated with the user
5. Use this token to send push notifications

## Testing Notifications

### Test from Firebase Console:
1. Go to **Firebase Console** → **Cloud Messaging**
2. Click **"Send your first message"**
3. Enter notification text
4. Click **"Send test message"**
5. Enter the FCM token from your device
6. Click **"Test"**

### Test from the App:
1. Open the app on a device
2. Enable notifications
3. Grant permission when prompted
4. The app should register with FCM
5. Check Android Studio logcat for the FCM token

## Troubleshooting

### "google-services.json not found"
- Ensure the file is in `android/app/google-services.json`
- Not in root directory, not in `android/` directory

### "Firebase API not enabled"
- Enable "Firebase Cloud Messaging API" in Google Cloud Console
- Go to: console.cloud.google.com → APIs & Services → Enable APIs

### "Default FirebaseApp is not initialized"
- Make sure google-services.json is in the correct location
- Clean and rebuild the project
- Check that the package name matches exactly

### Notifications not received
- Check that notification permission is granted
- Verify FCM token is being sent to your backend
- Check server logs for send errors
- Test with Firebase Console's "Send test message" feature

## Important Notes

- **Never commit `google-services.json` to version control** (already in .gitignore)
- FCM tokens can change, so refresh them periodically
- Test on physical devices, not just emulators
- iOS setup is separate (requires APNs configuration)

## Next Steps

After Firebase is configured:
1. The notification code in `src/lib/notifications.ts` will use Capacitor's native push notifications
2. Test notifications on a physical Android device
3. Implement backend API to send notifications at scheduled times
4. Store user preferences and FCM tokens in your database
