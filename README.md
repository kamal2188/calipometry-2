# Caliperometry

A professional body composition and nutrition coaching app for personal trainers and clients.

## Features

- **Caliper Testing** — Jackson-Pollock 7-site body fat measurement
- **Macro Calculator** — Personalised daily macro targets based on body composition
- **AI Meal Builder** — Claude-powered meal plans using Tesco UK foods
- **Budget Planner** — Budget-based meal planning with Tesco shopping lists
- **Client Management** — Save and manage multiple client profiles

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/caliperometry.git
cd caliperometry
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Anthropic API key
```bash
cp .env.example .env
```
Then edit `.env` and add your key from https://console.anthropic.com

### 4. Run locally
```bash
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variable: `REACT_APP_ANTHROPIC_API_KEY` = your key
4. Deploy

## Tech Stack

- React 18
- Claude API (claude-sonnet-4-6) for AI meal planning
- localStorage for client data persistence
- No other dependencies — pure React
