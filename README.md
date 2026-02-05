# Push-Up Challenge Tracker

A 30-day progressive push-up training program with progress tracking, optional Google sign-in for cross-device sync, and LinkedIn sharing.

## Features

- **Works Without Sign-In**: Use the app immediately - progress is saved locally in your browser
- **30-Day Progressive Plan**: Scientifically designed program that scales from your current ability to your target goal
- **Progress Tracking**: Check off completed days with satisfying green glow animations
- **Dashboard Stats**: View your streak, completion percentage, and days remaining
- **Optional Google Sign-In**: Sign in to sync progress across devices and browsers
- **LinkedIn Sharing**: Share your progress and achievements with your network
- **Mobile-First Design**: Beautiful vertical list layout on mobile, grid on desktop

## Tech Stack

- **Framework**: [Astro](https://astro.build/) with React integration
- **Database**: [Neon PostgreSQL](https://neon.tech/) (serverless Postgres) - only needed for signed-in users
- **Authentication**: Google OAuth (direct integration, no heavy auth libraries)
- **Local Storage**: Browser localStorage for anonymous users
- **Deployment**: [Vercel](https://vercel.com/)

## Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd keeppushing
npm install
```

### 2. Run Development Server (Local-Only Mode)

For local development without database/auth:

```bash
npm run dev
```

Visit `http://localhost:4321` - the app works fully with localStorage!

### 3. Set Up Neon Database (Optional - for cross-device sync)

1. Create a free account at [Neon](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string
4. Run the migration in `migrations/001_create_tables.sql` in the Neon SQL Editor

### 4. Set Up Google OAuth (Optional - for sign-in)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Go to "OAuth consent screen" and configure
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:4321/api/auth/callback` (dev) and your production URL
7. Copy Client ID and Client Secret

### 5. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

### 6. Run with Full Features

```bash
npm run dev
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Add your production URL to Google OAuth authorized redirect URIs
5. Deploy!

## How It Works

### Anonymous Users (No Sign-In)
- Progress is stored in browser localStorage
- Works offline after first load
- Data persists until browser data is cleared

### Signed-In Users
- Progress syncs to Neon PostgreSQL database
- Access your progress from any device
- Local data is synced when you sign in

## Project Structure

```
src/
├── components/
│   ├── AuthButton.tsx       # Optional Google sign-in button
│   ├── Dashboard.tsx        # Stats overview (streak, %, days left)
│   ├── DayCard.tsx          # Individual day with completion toggle
│   ├── PushUpApp.tsx        # Main app component
│   ├── ShareButton.tsx      # LinkedIn share button
│   └── StartDateModal.tsx   # Challenge setup modal
├── lib/
│   ├── auth.ts              # Auth helpers
│   └── db.ts                # Neon database client
├── pages/
│   ├── api/
│   │   ├── auth/            # OAuth endpoints
│   │   ├── challenge.ts     # Challenge CRUD
│   │   └── complete-day.ts  # Day completion toggle
│   └── index.astro          # Main page
└── env.d.ts                 # TypeScript definitions
```

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview build locally before deploying       |

## License

MIT
