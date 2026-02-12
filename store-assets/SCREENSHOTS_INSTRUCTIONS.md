# How to Capture Play Store Screenshots

Google Play requires **at least 2 and up to 8** phone screenshots. Use these steps to capture them from your app.

## Requirements

- Format: PNG or JPG (24-bit)
- Min 2, max 8 screens
- Recommended size: 1080×1920 or 1440×2560 (9:16 or similar)
- Max 8 MB per file

## Option A: Android device

1. Open Keep Pushing on your phone.
2. Go to the screen you want (see list below).
3. Take a screenshot:
   - **Most Android phones:** Power + Volume Down at the same time.
   - Or: Quick settings → Screenshot tile.
4. Find the image in your Gallery or Files (e.g. Screenshots folder).
5. Copy to your computer (USB, Google Photos, or cloud) and rename (e.g. `01-home.png`).

## Option B: Android Studio emulator

1. Run the app: `npx cap open android` then click Run (green play button).
2. In the emulator toolbar, click the **camera** icon to capture a screenshot.
3. Choose "Save" and pick a folder (e.g. `store-assets/screenshots/`).
4. Rename files in order: `01-home.png`, `02-dashboard.png`, etc.

## Option C: ADB (device or emulator)

```bash
# List devices
adb devices

# Capture screenshot to device
adb shell screencap -p /sdcard/screenshot.png

# Pull to your computer
adb pull /sdcard/screenshot.png store-assets/screenshots/01-home.png
```

Repeat for each screen, renaming each file.

## Suggested screens (in order)

1. **01-home.png** – Main challenge view (list of days 1–30).
2. **02-dashboard.png** – Dashboard with streak, progress %, days left.
3. **03-day-detail.png** – A single day expanded or workout description visible.
4. **04-notifications.png** – Notification toggle and time picker (if enabled).
5. **05-progress.png** – Several days marked complete (green checkmarks).
6. (Optional) Sign-in or share screen if you want to highlight those features.

## Optional: add device frame

To make screenshots look more polished, you can put them in a phone frame:

- [MockUPhone](https://mockuphone.com) – free, upload your screenshot.
- [Shots.so](https://shots.so) – browser tool.
- [Figma](https://figma.com) – use a device frame template and paste your screenshot.

Use the same aspect ratio as your screenshot (e.g. 9:16) so the frame fits.

## Upload in Play Console

1. Open your app in Play Console → Store presence → Main store listing.
2. Under "Phone screenshots", click "Add" and upload your images in order.
3. The first 2–4 screens show in search results; put your strongest screens first.

## Folder structure (optional)

You can keep raw screenshots in the repo like this:

```
store-assets/
  screenshots/
    01-home.png
    02-dashboard.png
    03-day-detail.png
    ...
```

Add `store-assets/screenshots/` to `.gitignore` if you prefer not to commit large images.
