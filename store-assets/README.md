# Play Store Assets

This folder holds assets and copy for the Google Play Store listing.

## Contents

- **STORE_LISTING_COPY.md** – Short description, full description, release notes, category. Copy-paste into Play Console.
- **legal/** (in project root) – Privacy policy and Terms of Service (Markdown + HTML). Host the HTML at a public URL and use that URL in Play Console.

## App icon and feature graphic

- **icon-512x512.png** – Use for Play Console "App icon" (512×512).
- **feature-graphic-1024x500.png** – Use for Play Console "Feature graphic" (1024×500).

Place these in this folder after generation, then upload them in Play Console.

## Screenshots

Play Store requires at least 2 phone screenshots. Capture them from the app:

1. Run the app on a device or emulator.
2. Open the screen you want (e.g. main challenge list, dashboard, notification settings).
3. Take a screenshot (device shortcut or Android Studio / adb).
4. Save as PNG or JPG (e.g. 01-home.png, 02-dashboard.png).
5. Upload in Play Console under "Phone screenshots".

Recommended order: Home → Dashboard → Day detail → Notifications → Completed progress.

## Checklist before submit

- [ ] Short description (≤80 chars) from STORE_LISTING_COPY.md
- [ ] Full description from STORE_LISTING_COPY.md
- [ ] Release notes from STORE_LISTING_COPY.md
- [ ] Privacy policy HTML hosted and URL set in Play Console
- [ ] App icon 512×512 uploaded
- [ ] Feature graphic 1024×500 uploaded
- [ ] At least 2 phone screenshots uploaded
- [ ] Support email updated in STORE_LISTING_COPY.md and in legal HTML files
- [ ] Category: Health & Fitness
