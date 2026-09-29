# SportsDashboard

A unified, serverless multi-sport fixture dashboard built with React, Vite, Tailwind CSS, and TypeScript. It fetches live and upcoming fixture schedules directly from the browser, standardises the data, converts it to your local timezone, and allows you to follow teams/leagues and export matches to your calendar (`.ics`).

## Features

- **Multi-Sport Support:** Track Football (English Premier League, UEFA Champions League), Formula 1 (OpenF1 API), Cricket (CricAPI / ESPN), and Basketball (NBA).
- **Client-Side Architecture:** Zero backend or database required; fetches live JSON data straight from public sports APIs.
- **Local Timezone Conversion:** Automatically displays match times and race sessions in your local browser timezone.
- **Favorites & Team Following:** Keep track of your favourite teams and leagues with persistent local storage.
- **Calendar Export:** Export individual fixtures or race sessions directly to `.ics` calendar files.
- **Modern Responsive UI:** Built with Tailwind CSS and Lucide React icons.

## Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date Utilities:** date-fns
- **Calendar Generation:** ics

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shux347/SportsDashboard.git
   cd SportsDashboard/SportsDashboard-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The static build output will be generated in the `dist` directory, ready to be deployed on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

## License

MIT
