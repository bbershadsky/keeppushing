# Android Release Signing Guide

This guide explains how to create a release keystore and configure your app for Play Store submission.

## ⚠️ IMPORTANT: Keystore Security

Your keystore file is **CRITICAL** and **IRREPLACEABLE**:
- If you lose it, you **cannot update your app** on Play Store
- Never commit it to version control (already in .gitignore)
- Store backup copies in multiple secure locations
- Use a strong password you won't forget

## Step 1: Generate Release Keystore

Run this command to create your keystore:

```bash
keytool -genkey -v -keystore keeppushing-release.keystore \
  -alias keeppushing -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
1. **Keystore password**: Choose a strong password (you'll need this!)
2. **Key password**: Can be same as keystore password or different
3. **Your name**: Your name or company name
4. **Organizational unit**: (optional, can press Enter)
5. **Organization**: Your company/organization name
6. **City**: Your city
7. **State**: Your state/province
8. **Country code**: Two-letter code (e.g., US, UK, CA)

**Example output:**
```
Enter keystore password: [your-password]
Re-enter new password: [your-password]
What is your first and last name?
  [Unknown]:  John Doe
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  Keep Pushing
What is the name of your City or Locality?
  [Unknown]:  San Francisco
What is the name of your State or Province?
  [Unknown]:  California
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=John Doe, OU=Unknown, O=Keep Pushing, L=San Francisco, ST=California, C=US correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
        for: CN=John Doe, OU=Unknown, O=Keep Pushing, L=San Francisco, ST=California, C=US
Enter key password for <keeppushing>
        (RETURN if same as keystore password):  
[Storing keeppushing-release.keystore]
```

The keystore file `keeppushing-release.keystore` will be created in the current directory.

## Step 2: Move Keystore to Safe Location

Move the keystore to your android/app directory:

```bash
mv keeppushing-release.keystore android/app/
```

## Step 3: Create keystore.properties

Create a file `android/app/keystore.properties` with your credentials:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=keeppushing
storeFile=keeppushing-release.keystore
```

**Replace:**
- `YOUR_KEYSTORE_PASSWORD` with your keystore password
- `YOUR_KEY_PASSWORD` with your key password (may be same as keystore password)

**Example:**
```properties
storePassword=MySecurePassword123!
keyPassword=MySecurePassword123!
keyAlias=keeppushing
storeFile=keeppushing-release.keystore
```

## Step 4: Update build.gradle (Already Configured!)

The `android/app/build.gradle` file has been pre-configured to use your keystore. 

Here's what's been added:

```gradle
// Load keystore properties
def keystorePropertiesFile = rootProject.file("app/keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 5: Update Version Information

Before building a release, update the version in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.keeppushing.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 1           // Increment for each release (1, 2, 3, ...)
    versionName "1.0.0"     // User-visible version (1.0.0, 1.1.0, etc.)
}
```

**Version Guidelines:**
- **versionCode**: Integer that increases with each release (1, 2, 3, ...)
  - Play Store requires each new release to have a higher versionCode
  - Never reuse or decrease version codes
- **versionName**: User-visible version string (e.g., "1.0.0", "1.1.0", "2.0.0")
  - Use semantic versioning: MAJOR.MINOR.PATCH
  - Not enforced by Play Store, but shown to users

## Step 6: Verify Configuration

Test that signing is configured correctly:

```bash
cd android
./gradlew assembleRelease
```

If successful, you'll see:
```
BUILD SUCCESSFUL in XXs
```

The signed APK will be at:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Security Checklist

Before proceeding:

- ✅ Keystore file is in `android/app/keeppushing-release.keystore`
- ✅ `keystore.properties` is in `android/app/`
- ✅ Both files are in `.gitignore` (already configured)
- ✅ Backup copies of keystore stored securely
- ✅ Passwords documented in secure password manager
- ✅ Never commit these files to git

## Backup Your Keystore

**CRITICAL**: Create multiple backups immediately:

1. **Cloud storage** (encrypted): Google Drive, Dropbox, iCloud
2. **External drive**: USB drive in safe location
3. **Password manager**: Store keystore + passwords together
4. **Company server**: If applicable

Suggested backup locations:
```bash
# Copy to multiple locations
cp android/app/keeppushing-release.keystore ~/Backup/
cp android/app/keeppushing-release.keystore /Volumes/USB-Drive/
# Upload to cloud storage manually
```

## Get SHA-1 and SHA-256 Fingerprints

For Firebase and Google Sign-In, you'll need your release key fingerprints:

```bash
keytool -list -v -keystore android/app/keeppushing-release.keystore -alias keeppushing
```

Look for:
```
Certificate fingerprints:
     SHA1: AA:BB:CC:DD:... (copy this)
     SHA256: 11:22:33:44:... (copy this)
```

Add these to Firebase Console:
1. Go to Firebase Console → Project Settings
2. Select your Android app
3. Click "Add fingerprint"
4. Paste SHA-1 and SHA-256

## Troubleshooting

### "keystore.properties not found"
- Ensure file is in `android/app/keystore.properties`
- Check file permissions
- Don't put it in root `android/` directory

### "Incorrect keystore password"
- Double-check password in keystore.properties
- Try generating keystore again if forgotten

### "keyAlias not found"
- Verify the alias matches what you used when generating keystore
- List aliases: `keytool -list -keystore android/app/keeppushing-release.keystore`

### "Build fails with signing error"
- Make sure keystore file path is correct
- Check that keystore.properties has all required fields
- Verify keystore file exists at specified location

## Using Google Play App Signing (Recommended)

Google offers to manage your signing key securely:

1. When uploading first release to Play Console
2. Choose **"Let Google manage and protect your app signing key"**
3. Upload your keystore or generate a new one
4. Google will manage the final signing key
5. You keep your "upload key" for future releases

Benefits:
- Google securely stores the final signing key
- If you lose upload key, Google can reset it
- More secure than managing keys yourself

You'll still need your keystore for the first upload!

## Next Steps

Once signing is configured:
1. ✅ Build release AAB: `./gradlew bundleRelease`
2. ✅ Test the release build on device
3. ✅ Prepare Play Store assets
4. ✅ Create Play Console account
5. ✅ Upload and publish
