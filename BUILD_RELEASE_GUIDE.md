# Build Release AAB for Play Store

This guide explains how to build a production-ready Android App Bundle (AAB) for Google Play Store submission.

## Prerequisites

Before building a release:

1. ✅ **Keystore created** (see RELEASE_SIGNING_GUIDE.md)
2. ✅ **keystore.properties configured** in `android/app/`
3. ✅ **Firebase configured** (optional, but recommended for push notifications)
4. ✅ **App tested** on device/emulator
5. ✅ **All features working** as expected

## What is an AAB?

**Android App Bundle (AAB)** is the publishing format for Google Play Store:
- Smaller download size for users (Google optimizes per device)
- Required by Play Store (APKs still work for testing)
- Contains all resources, optimized by Google for each device

## Step 1: Update Version Information

Before each release, increment version numbers in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.keeppushing.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2           // INCREMENT THIS: 1 → 2 → 3 → ...
    versionName "1.0.1"     // UPDATE THIS: "1.0.0" → "1.0.1" → "1.1.0"
}
```

**Version Guidelines:**
- **versionCode**: Must be higher than previous release (Play Store requirement)
- **versionName**: User-visible version (semantic versioning recommended)

**Examples:**
- First release: versionCode=1, versionName="1.0.0"
- Bug fix: versionCode=2, versionName="1.0.1"
- New features: versionCode=3, versionName="1.1.0"
- Major update: versionCode=4, versionName="2.0.0"

## Step 2: Clean Build Directory

Start with a clean slate:

```bash
cd android
./gradlew clean
```

## Step 3: Build the Web Assets

Make sure your Astro app is built with latest changes:

```bash
cd /Users/bopr/Documents/keeppushing
npm run build
npx cap sync android
```

## Step 4: Build Release AAB

Navigate to android directory and build:

```bash
cd android
./gradlew bundleRelease
```

**This command will:**
1. Compile your app code
2. Bundle all resources
3. Sign with your release keystore
4. Create optimized AAB

**Expected output:**
```
> Task :app:bundleRelease

BUILD SUCCESSFUL in 45s
67 actionable tasks: 67 executed
```

## Step 5: Locate the AAB File

Your signed AAB will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

**File size**: Typically 5-15 MB (varies based on app size)

## Step 6: Verify the AAB

Check the AAB is properly signed:

```bash
# Extract info about the AAB
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab

# Should show:
# jar verified.
```

Or use bundletool (if installed):
```bash
bundletool build-apks --bundle=app/build/outputs/bundle/release/app-release.aab \
  --output=test.apks --mode=universal

bundletool validate --bundle=app/build/outputs/bundle/release/app-release.aab
```

## Step 7: Test the Release Build (Optional but Recommended)

Before uploading to Play Store, test the release build:

### Option A: Generate APK from AAB for testing

```bash
# Install bundletool if not installed
# Download from: https://github.com/google/bundletool/releases

bundletool build-apks \
  --bundle=app/build/outputs/bundle/release/app-release.aab \
  --output=app-release.apks \
  --mode=universal

# Extract the universal APK
unzip app-release.apks -d extracted/

# Install on connected device
adb install extracted/universal.apk
```

### Option B: Use internal testing track in Play Console

Upload to Play Console's internal testing track first (see PLAY_CONSOLE_GUIDE.md).

## Common Build Issues

### "keystore.properties not found"
**Solution:**
- Create keystore first (see RELEASE_SIGNING_GUIDE.md)
- Ensure `android/app/keystore.properties` exists

### "Keystore password incorrect"
**Solution:**
- Verify password in `keystore.properties`
- Check for typos or extra spaces

### "Version code must be greater than X"
**Solution:**
- Play Store rejects version codes ≤ previous release
- Increment versionCode in build.gradle

### "Build failed with exit code 1"
**Solution:**
- Check error message in output
- Run `./gradlew clean` then try again
- Ensure all dependencies are installed

### "Execution failed for task ':app:lintRelease'"
**Solution:**
- Disable lint errors (not recommended) or fix issues
- Add to `android/app/build.gradle`:
```gradle
android {
    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
}
```

## Pre-Upload Checklist

Before uploading to Play Store:

- ✅ Version code incremented
- ✅ Version name updated
- ✅ App tested on device
- ✅ All features working
- ✅ No critical bugs
- ✅ Push notifications tested (if using Firebase)
- ✅ Authentication tested (if using Google Sign-In)
- ✅ AAB file verified and signed
- ✅ File size reasonable (<150 MB)

## AAB File Details

Your AAB contains:
- Compiled app code (DEX files)
- Resources (images, layouts, strings)
- Native libraries (if any)
- App manifest
- Signing information

Play Store will generate optimized APKs from this AAB for:
- Different screen densities
- Different CPU architectures
- Different Android versions

Users download only what their device needs!

## Release Build Workflow

**For each new release:**

1. Make code changes
2. Test thoroughly
3. Update version code/name
4. Build web assets: `npm run build && npx cap sync android`
5. Clean: `cd android && ./gradlew clean`
6. Build AAB: `./gradlew bundleRelease`
7. Verify AAB is signed
8. Test (optional but recommended)
9. Upload to Play Console
10. Submit for review

## Quick Release Command

Combine all steps:

```bash
# From project root
npm run build && \
npx cap sync android && \
cd android && \
./gradlew clean bundleRelease && \
echo "✅ Release AAB built successfully!" && \
echo "📦 Location: android/app/build/outputs/bundle/release/app-release.aab"
```

## File Sizes

Typical AAB size: **5-20 MB**
Play Store limit: **150 MB**

If your AAB exceeds 150 MB:
- Use expansion files
- Remove unused resources
- Optimize images
- Enable code/resource shrinking

## Next Steps

Once AAB is built:
1. ✅ Prepare Play Store assets (screenshots, descriptions)
2. ✅ Create Play Console account
3. ✅ Upload AAB to Play Console
4. ✅ Fill in store listing details
5. ✅ Submit for review

See **PLAY_STORE_SUBMISSION.md** for upload instructions.

## Troubleshooting Build Times

Slow builds? Try:

```bash
# Enable Gradle daemon (faster subsequent builds)
./gradlew --daemon

# Use parallel execution
./gradlew bundleRelease --parallel

# Use build cache
./gradlew bundleRelease --build-cache
```

## Backing Up Release AABs

Keep copies of each release:

```bash
# Create releases directory
mkdir -p releases

# Copy with version number
cp app/build/outputs/bundle/release/app-release.aab \
   releases/keeppushing-v1.0.0-release.aab
```

This helps if you need to reference previous builds or rollback.
