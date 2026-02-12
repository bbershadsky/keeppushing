# Pre–Play Store Submission Checklist

Use this **before** you upload to Play Console. Everything here is optional except a correctly signed AAB and basic testing.

---

## 1. Release AAB signed with your keystore

You added `keystore.properties` after building. So the AAB you have may be **debug-signed**. For Play Store you need one signed with your **release** keystore.

**Do this from the project root** (`keeppushing/`):

```bash
npm run build
npx cap sync android
cd android
./gradlew clean bundleRelease
```

- Your **release AAB** is: `android/app/build/outputs/bundle/release/app-release.aab`
- Use this file when you create a release in Play Console.

---

## 2. Run from the correct directory (fix “android platform has not been added”)

The error and `cd: no such file or directory: android` usually mean the first commands were run from a **parent** folder (e.g. `Documents/` instead of `keeppushing/`).

**Always run Capacitor and Gradle from the app root:**

```bash
cd /Users/bopr/Documents/keeppushing   # or your actual path
npm run build
npx cap sync android
cd android
./gradlew clean bundleRelease
```

---

## 3. Firebase for push notifications (optional)

- **For push to work on device:** put `google-services.json` in `android/app/` (from Firebase Console → your Android app → download).
- You already have a Firebase Admin SDK key in the repo; that’s for **sending** notifications from a server, not for the Android app. The Android app needs `google-services.json` in `android/app/`.
- If you don’t add it, the app still runs; only push notifications won’t work until you add it and rebuild.

---

## 4. Test the release build (recommended)

- Install the release AAB on a real device (e.g. via “Internal testing” in Play Console, or by building a universal APK from the AAB and sideloading).
- Smoke-test: launch, set challenge, complete a day, enable notifications (if you added Firebase), sign in if you use it.

---

## 5. Security / hygiene

- **Keystore backup:** You have `keeppushing-release.keystore`. Back it up somewhere safe (e.g. encrypted backup). If you lose it, you can’t update this app on Play Store.
- **Secrets:**  
  - `keystore.properties` and `*.keystore` are in `.gitignore` — keep it that way.  
  - Firebase Admin SDK key: `*firebase-adminsdk*.json` is now in `.gitignore`. If that file was ever committed, rotate the key in Firebase and remove it from git history.
- **Template:** `keystore.properties.template` was reset to placeholders so real passwords aren’t in the repo. Your real `keystore.properties` (in `android/app/`) is unchanged and not committed.

---

## 6. Version for next release

- In `android/app/build.gradle`, `versionCode` and `versionName` are set (e.g. `1` and `"1.0.0"`).
- For every **new** upload to Play Store, increase `versionCode` (and optionally `versionName`), then run the same build commands again.

---

## Summary: what’s left besides Play Store submission

| Item | Status / action |
|------|------------------|
| Keystore + `keystore.properties` | Done by you. |
| Rebuild release AAB with release signing | Do once from project root (step 1). |
| Run commands from project root | Avoid “android not added” / “no such file: android” (step 2). |
| Firebase `google-services.json` in `android/app/` | Optional; only if you want push. |
| Test release build on device | Recommended. |
| Backup keystore + ignore Firebase Admin key | Done / updated in repo. |
| Play Store assets + submission | Follow PLAY_STORE_ASSETS_GUIDE.md and PLAY_STORE_SUBMISSION.md. |

After you’ve done step 1 (and optionally 3 and 4), you’re ready to upload the new `app-release.aab` and complete the store listing and submission.
