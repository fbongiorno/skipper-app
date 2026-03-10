# Skipper.com — AI Boat Trip Planner

An AI-powered sailing and boat trip planning tool built with Next.js and Claude AI.

## Features
- Route planning between any two ports
- Weather and wind condition summaries
- Full trip checklist (safety, navigation, provisions, documents)
- Cost estimates
- Pro skipper tips
- Affiliate monetization built in (Boatsetter, BoatUS, West Marine)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key
```

### 3. Run locally
```bash
npm run dev
# Visit http://localhost:3000
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo
4. Add environment variable: `ANTHROPIC_API_KEY=your_key_here`
5. Railway auto-detects Next.js and deploys

That's it — zero maintenance required after deployment.

## Monetization
- **Boatsetter affiliate**: Update referral link in `app/page.tsx`
- **BoatUS insurance**: Update referral link in `app/page.tsx`
- **West Marine**: Update referral link in `app/page.tsx`
- **Display ads**: Add Google AdSense to `app/layout.tsx` once approved

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude API
