# Product Requirements Document: Serverless Multi-Sport Fixture Dashboard

## 1. Project Overview
Build a static, client-side only Single Page Application (SPA) that acts as a unified sports fixture dashboard. The app must fetch live and upcoming fixture schedules for multiple sports directly from the browser, standardise the data, convert it to the user's local timezone, and allow the user to generate `.ics` calendar files.

**Core Constraints:**
- **Zero Backend:** There is no server, no database, and no Node.js background scheduler. All API calls must be made client-side from the browser.
- **No Paid APIs:** Use the free, open endpoints documented below.
- **Deployment:** The project must be buildable into static files so it can be deployed on Vercel, Cloudflare Pages, or GitHub Pages.

## 2. Tech Stack
- **Framework:** Next.js (App Router configured for Static Export) or Vite + React. 
- **Language:** TypeScript.
- **Styling:** Tailwind CSS + Lucide React (for icons).
- **State Management:** React hooks and `localStorage` to save the user's favourite teams/leagues.
- **Date Handling:** `date-fns` (for timezone conversions, countdowns, and formatting).
- **Calendar Export:** `ics` npm package (or manual string generation for `.ics` blobs).

## 3. Data Sources & API Endpoints

### A. ESPN Hidden API (Football, Cricket, Basketball)
ESPN runs open JSON endpoints that do not require an API key and support CORS for client-side fetching.
- **Base Pattern:** `https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard`
- **Relevant Endpoints:**
  - English Premier League: `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard`
  - UEFA Champions League: `https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard`
  - NBA: `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard`
  - International Cricket: `https://site.api.espn.com/apis/site/v2/sports/cricket/all/scoreboard`
- **Data Structure:** The response contains an `events` array. Each event has a `date` (UTC string), `competitions[0].competitors` (home and away teams), `status.type.state` (pre, in, post), and broadcast info.

### B. OpenF1 API (Motorsport)
Open-source API for F1 data. Historical data (including schedule) is free and requires no key.
- **Endpoint:** `https://api.openf1.org/v1/sessions`
- **Parameters:** `?year=2026` (Append query params to filter by the current year)
- **Data Structure:** Returns an array of session objects containing `session_name` (e.g., "Race", "Qualifying"), `date_start` (ISO 8601 UTC time), and `country_name`.

## 4. Application Architecture & Data Flow

### Step 1: Data Normalisation Layer
Create an abstract `Fixture` TypeScript interface so the UI doesn't care if the data came from ESPN or OpenF1.
```typescript
interface Fixture {
  id: string;
  sport: 'football' | 'f1' | 'basketball' | 'cricket';
  leagueName: string;
  eventName: string; // e.g., "Arsenal vs Chelsea" or "Italian GP - Race"
  utcDate: string; // ISO 8601
  status: 'upcoming' | 'live' | 'completed';
  homeTeam?: { name: string; logoUrl: string; score?: string };
  awayTeam?: { name: string; logoUrl: string; score?: string };
}