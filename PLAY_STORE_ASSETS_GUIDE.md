# Play Store Assets Guide

This guide lists all assets required for your Google Play Store listing and how to create them.

## Required Assets Overview

| Asset | Size | Format | Required | Purpose |
|-------|------|--------|----------|---------|
| App Icon | 512x512 | PNG | ✅ Yes | Store listing icon |
| Feature Graphic | 1024x500 | PNG/JPG | ✅ Yes | Store page banner |
| Phone Screenshots | Various | PNG/JPG | ✅ Yes (2-8) | Show app UI |
| 7" Tablet Screenshots | Various | PNG/JPG | ❌ Optional | Tablet UI |
| 10" Tablet Screenshots | Various | PNG/JPG | ❌ Optional | Tablet UI |
| Short Description | 80 chars | Text | ✅ Yes | Brief tagline |
| Full Description | 4000 chars | Text | ✅ Yes | Detailed info |
| App Category | - | Selection | ✅ Yes | Store category |
| Content Rating | - | Questionnaire | ✅ Yes | Age rating |
| Privacy Policy | - | URL | ✅ Yes | Privacy info |

## 1. App Icon (512x512 PNG)

**Requirements:**
- Dimensions: 512x512 pixels
- Format: 32-bit PNG with alpha channel
- Max file size: 1024 KB
- No rounded corners (Play Store adds them)
- No text (should be readable at small sizes)

**Design Tips:**
- Simple, memorable design
- Works well at all sizes (48px to 512px)
- Reflects app's purpose (fitness, motivation)
- High contrast for visibility

**Suggested Design for Keep Pushing:**
- Centered icon with push-up or fitness theme
- Orange accent color (#f97316) matching app
- Dark background (#09090b) or transparent
- Bold, simple shapes

**Create with:**
- Figma (free online design tool)
- Canva (templates available)
- Adobe Illustrator
- GIMP (free alternative)

**Example prompt for AI generation:**
```
"A minimal app icon for a fitness app called 'Keep Pushing', 
featuring a stylized push-up figure or upward arrow, 
orange accent color on dark background, 512x512, simple modern design"
```

## 2. Feature Graphic (1024x500 PNG/JPG)

**Requirements:**
- Dimensions: 1024x500 pixels
- Format: PNG or JPG
- Max file size: 1024 KB
- Appears at top of store listing

**Design Tips:**
- Eye-catching banner showcasing app
- Include app name/logo
- Show key features or value proposition
- Text should be readable
- Avoid clutter

**Suggested Content:**
- App name: "Keep Pushing"
- Tagline: "30-Day Push-Up Challenge"
- Visual: Person doing push-ups or progress chart
- Colors: Dark theme with orange accents

**Template Layout:**
```
┌─────────────────────────────────────────┐
│  [App Icon]   KEEP PUSHING              │
│               30-Day Push-Up Challenge  │
│               [Progress Visual]         │
└─────────────────────────────────────────┘
```

## 3. Screenshots (Phone)

**Requirements:**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: PNG or JPG (24-bit)
- Dimensions: 16:9 aspect ratio recommended
  - Common: 1080x1920, 1440x2560, 1440x2880
- Max file size: 8 MB each

**Recommended Screenshots:**

1. **Home Screen** - Challenge overview with day cards
2. **Dashboard** - Stats, streak, progress percentage
3. **Day Detail** - Workout plan for specific day
4. **Notifications** - Push notification settings
5. **Completed Days** - Show checked-off days with green glow
6. **Progress Stats** - Visual representation of progress
7. **Google Sign-In** - Cross-device sync feature (optional)
8. **Share Feature** - LinkedIn sharing (optional)

**How to Capture:**

Using Android Studio Emulator:
1. Run app in emulator
2. Navigate to desired screen
3. Click camera icon in emulator toolbar
4. Save screenshot

Using Physical Device:
1. Connect device via USB
2. Open Android Studio
3. View → Tool Windows → Device File Explorer
4. Or use: `adb shell screencap -p /sdcard/screenshot.png`
   Then: `adb pull /sdcard/screenshot.png`

**Frame Screenshots (Optional but Professional):**
- Use [mockuuups.studio](https://mockuuups.studio/) (free)
- Use [smartmockups.com](https://smartmockups.com/)
- Use [shots.so](https://shots.so/)
- Shows app in realistic device frame

## 4. Short Description (80 characters)

**Requirements:**
- Maximum 80 characters
- Appears in search results
- First impression

**Examples:**
- "Transform your fitness with a 30-day progressive push-up challenge"
- "Master push-ups in 30 days with personalized daily workouts"
- "Build strength with daily push-up challenges tailored to your level"

**Your App:**
```
30-day push-up challenge with progress tracking and daily reminders
```
(69 characters)

## 5. Full Description (Up to 4000 characters)

**Structure:**

```markdown
# Keep Pushing - 30-Day Push-Up Challenge

Transform your upper body strength with Keep Pushing, the ultimate push-up training app designed to take you from beginner to champion in just 30 days.

## Why Keep Pushing?

✅ **Personalized Plans** - Customize your starting point and goal
✅ **Daily Workouts** - Progressive training from day 1 to day 30
✅ **Track Progress** - Mark completed days and watch your streak grow
✅ **Smart Reminders** - Never miss a workout with customizable notifications
✅ **Cross-Device Sync** - Sign in with Google to sync across devices
✅ **Share Achievements** - Post your progress to LinkedIn and inspire others

## How It Works

1. **Set Your Goal** - Choose your current ability (5-50 push-ups) and target
2. **Follow Your Plan** - Get a scientifically designed 30-day training program
3. **Complete Daily Workouts** - Each day builds on the previous
4. **Track Your Progress** - Watch your streak and completion percentage grow
5. **Reach Your Goal** - Hit your target push-ups by day 30!

## Features

📈 **Progressive Training** - Gradually increase difficulty for optimal gains
🔔 **Daily Reminders** - Set notification time to stay consistent
📊 **Dashboard Stats** - View streak, progress %, and days remaining
✅ **Easy Tracking** - One-tap to mark days complete
🌙 **Dark Mode** - Beautiful, eye-friendly design
📱 **Works Offline** - All data stored locally on your device
☁️ **Cloud Sync** - Optional Google sign-in for multi-device access

## Who Is This For?

Whether you're a complete beginner or looking to improve your push-up count, Keep Pushing adapts to your level. Perfect for:

- Beginners starting their fitness journey
- Athletes supplementing their training
- Anyone wanting to build upper body strength
- Fitness enthusiasts seeking a quick daily workout
- People needing motivation and accountability

## The 30-Day Challenge

Our scientifically designed program progressively increases volume and intensity. Mix of:
- Standard push-ups
- Plank holds for core strength
- Rest days for recovery
- Final test day to hit your goal

No equipment needed. Train anywhere, anytime.

## Privacy & Data

Your data is yours:
- All progress stored locally on your device
- Optional Google sign-in for cloud sync only
- No data sold or shared with third parties
- See our privacy policy for details

## Start Your Journey Today!

Join thousands who've transformed their strength. Download Keep Pushing and start your 30-day journey to a stronger you.

Questions? Contact: support@keeppushing.app (replace with real email)
```

(~2000 characters - you have room for more!)

## 6. App Category

**Primary Category:** Health & Fitness

**Alternatives:**
- Sports
- Lifestyle

## 7. Content Rating

Complete the questionnaire in Play Console:

**Questions you'll answer:**
- Does app contain violence? **No**
- Does app contain sexual content? **No**
- Does app contain profanity? **No**
- Does app contain controlled substances? **No**
- Does app simulate gambling? **No**
- Does app share user data? **Only if using Google Sign-In**
- Does app have social features? **Yes (LinkedIn sharing)**
- Does app have ads? **No**
- Does app have in-app purchases? **No**

**Expected Rating:** Everyone (all ages)

## 8. Privacy Policy

**Required if:**
- App requests permissions
- App collects user data
- App uses Google Sign-In

**What to include:**
- What data you collect (name, email if signed in)
- How data is used (sync across devices, notifications)
- How data is stored (locally, Neon database)
- Third-party services (Google OAuth, Firebase)
- User rights (delete account, export data)

**Free Privacy Policy Generators:**
- [App Privacy Policy Generator](https://app-privacy-policy-generator.nisrulz.com/)
- [PrivacyPolicies.com](https://www.privacypolicies.com/)
- [Termly](https://termly.io/products/privacy-policy-generator/)

**Host your policy:**
- GitHub Pages (free)
- Vercel (free)
- Your own website
- Google Sites (free)

**Example URL structure:**
`https://keeppushing.app/privacy-policy`

## 9. Contact Information

**Required:**
- Email address for support
- Website (optional but recommended)

**Suggestions:**
- Create dedicated email: support@keeppushing.app
- Use personal email temporarily
- Add contact form on website

## Asset Creation Checklist

Before submitting to Play Store:

- ✅ App icon 512x512 PNG created
- ✅ Feature graphic 1024x500 created
- ✅ At least 2 phone screenshots captured
- ✅ Screenshots framed (optional but recommended)
- ✅ Short description written (≤80 chars)
- ✅ Full description written (detailed, compelling)
- ✅ App category selected (Health & Fitness)
- ✅ Content rating questionnaire ready
- ✅ Privacy policy written and hosted
- ✅ Support email created
- ✅ All assets reviewed for quality

## Quick Asset Template

Save all assets in organized folder:

```
play-store-assets/
├── icon-512x512.png
├── feature-graphic-1024x500.png
├── screenshots/
│   ├── 01-home.png
│   ├── 02-dashboard.png
│   ├── 03-day-detail.png
│   ├── 04-notifications.png
│   └── 05-progress.png
├── descriptions.txt
└── privacy-policy.html
```

## Tools & Resources

**Design:**
- [Figma](https://figma.com) - Free design tool
- [Canva](https://canva.com) - Templates and easy design
- [Photopea](https://photopea.com) - Free Photoshop alternative

**Mockups:**
- [MockUPhone](https://mockuphone.com) - Free device mockups
- [Shots.so](https://shots.so) - Framed screenshots

**Icons:**
- [Flaticon](https://flaticon.com) - Free icons
- [Icons8](https://icons8.com) - Icon generator

**AI Generation:**
- ChatGPT/DALL-E for icon concepts
- Midjourney for graphics
- Stable Diffusion for images

## Next Steps

Once assets are prepared:
1. ✅ Create Play Console account
2. ✅ Create new app listing
3. ✅ Upload all assets
4. ✅ Fill in store listing details
5. ✅ Upload AAB
6. ✅ Submit for review

See **PLAY_STORE_SUBMISSION.md** for submission instructions.
