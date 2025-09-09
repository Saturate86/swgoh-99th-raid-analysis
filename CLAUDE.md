# SWGoH Raid Analysis Tool - Project Context

## WICHTIGE ARBEITSANWEISUNGEN
- Diese CLAUDE.md Datei IMMER aktualisieren, wenn wichtige Änderungen am Projekt vorgenommen werden
- Neue Erkenntnisse, Konfigurationen oder strukturelle Änderungen hier dokumentieren
- Die Datei dient als persistenter Kontext zwischen Sessions

## Project Overview
Web application for analyzing Star Wars: Galaxy of Heroes (SWGoH) guild raid data from Wookiebot exports.

**Repository Type**: Template repository - designed to be forked by guilds for their own data analysis
**Live Demo**: https://dennisbecker.github.io/swgoh-raid-analysis/

## Core Purpose
- Guilds fork this repository
- Upload their Wookiebot CSV exports to `/data` directory  
- GitHub Actions automatically builds and deploys to GitHub Pages
- Provides raid performance analytics without manual data processing

## Tech Stack
- **Framework**: Astro.js 5.12.5 (Static Site Generator)
- **Styling**: Tailwind CSS 4.1.11
- **Charts**: Chart.js 4.4.0
- **Language**: TypeScript
- **Deployment**: GitHub Pages via GitHub Actions
- **Build**: Automatic on push to main branch

## Project Structure
```
/
├── data/                 # CSV files from Wookiebot (example files for development)
├── src/
│   ├── components/       # Astro components
│   │   ├── PlayerTable.astro    # Player statistics table
│   │   ├── RaidTable.astro      # Raid history table
│   │   ├── RaidTotalChart.astro # Total raid scores chart
│   │   ├── RankingChart.astro   # Player ranking chart
│   │   └── Layout.astro         # Main layout wrapper
│   ├── pages/
│   │   └── index.astro   # Main page with stats calculation
│   ├── content/
│   │   └── raids/        # JSON files (generated from CSV)
│   ├── config/           # Project configuration
│   ├── styles/           # Global CSS
│   └── utils/            # Utility functions
├── scripts/
│   ├── convert-csv-to-collections.js  # CSV → JSON converter
│   └── watch-data.js     # Development file watcher
├── .github/
│   └── workflows/        # GitHub Actions for deployment
└── dist/                 # Build output (gitignored)
```

## Data Flow
1. **Input**: Wookiebot CSV export (`/raid guild` command in Discord)
2. **Processing**: `convert-csv-to-collections.js` converts CSV → JSON for Astro Collections
3. **Analysis**: `index.astro` calculates statistics (last 5 raids focus)
4. **Output**: Static HTML with interactive charts and tables

## CSV Format (Wookiebot)
```csv
"name","allycode","estimatedScore","lastActualScore","diff","diffPercent"
"Player Name","123456789",4780500,3555000,-1225500,-25.6
```

## Key Features
- **Player Statistics**: Participation rate, average score, efficiency, trends
- **Raid History**: Complete raid performance tracking
- **Interactive Charts**: Visual performance analysis
- **Responsive Design**: Mobile-friendly Star Wars themed UI
- **Export Functionality**: Download data as CSV
- **Automatic Updates**: New CSV uploads trigger rebuild

## Development Commands
```bash
npm run dev          # Start dev server with file watching
npm run build        # Build for production
npm run preview      # Preview production build
npm run convert-csv  # Convert CSV files to JSON collections
```

## Deployment Process
1. Fork repository
2. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions)
3. Enable GitHub Actions (Actions tab → Enable workflows)
4. Upload CSV files to `/data` directory
5. GitHub Actions builds and deploys automatically
6. Site available at: `https://[username].github.io/[repository-name]/`

## Important Files
- `/src/pages/index.astro`: Main dashboard with statistics calculation (last 5 raids focus)
- `/src/pages/guild.astro`: Guild-wide analysis across ALL raids with trends and charts
- `/src/pages/player/[allycode].astro`: Individual player detail pages
- `/src/components/PlayerTable.astro`: Player performance table with sorting/filtering
- `/src/components/RaidTable.astro`: Individual raid details table
- `/src/config/project.ts`: Project configuration including BASE_URL for GitHub Pages
- `/src/config/guild.json`: Generated guild configuration (from data/guild-config.json)
- `/scripts/convert-csv-to-collections.js`: CSV parsing and conversion logic
- `/scripts/process-guild-config.js`: Guild configuration and logo processing
- `/.github/workflows/`: GitHub Actions workflow for deployment

## Statistics Calculation
- **Focus**: Last 5 raids for current performance metrics
- **Participation Rate**: Based on raids where player was in guild
- **Efficiency**: Actual score vs estimated score ratio
- **Trends**: Comparing last raid to average of last 5 raids (±10% threshold)
- **Active Players**: Only includes players from last 5 raids

## Current Status
- Example data files in `/data` for development
- Modified components: PlayerTable.astro, RaidTable.astro, global.css
- 6 example CSV files from "Order 66" guild

## Notes for Future Development
- The `/data` directory contains example files for development
- Production guilds replace these with their own Wookiebot exports
- All statistics focus on last 5 raids for relevance
- Site rebuilds automatically on CSV upload via GitHub Actions

## Guild Customization System
- **Configuration File**: `data/guild-config.json` (user-editable)
  - `guildName`: Guild display name
  - `title`: Application title
  - `description`: Application description
  - `logo`: Custom logo filename (must be in data/ directory)
  - `theme`: Colors (primaryColor, accentColor)

- **Build Process**: `npm run process-config` (runs automatically)
  - Copies custom logo from `data/` to `public/custom-logo.*`
  - Generates `src/config/guild.json` for components to use
  - Falls back to defaults if no custom config found

- **Logo Handling**:
  - Default: `public/bataillon-logo.png`
  - Custom: Place logo file in `data/` directory, specify filename in guild-config.json
  - System copies to `public/custom-logo.*` and updates `logoFile` in generated config

## BASE_URL Configuration
- The project uses a dynamic BASE_URL configured in `/src/config/project.ts`
- BASE_URL is automatically set based on environment:
  - Development: `/` (localhost)
  - Production: `/[repository-name]/` (GitHub Pages)
- All internal links (e.g., player detail pages) must use the BASE_URL to work correctly on GitHub Pages
- Example: Player links in `PlayerTable.astro` use `${baseUrl}/player/${allycode}`
- The BASE_URL is read from `import.meta.env.BASE_URL` or defaults based on production/development mode

## Page Structure
- **Dashboard** (`/`): Last 5 raids focus, key metrics, player/raid tables
- **Guild Analysis** (`/guild/`): Complete raid history analysis with charts
  - All-time statistics and trends
  - Raid frequency analysis (days between raids)
  - Moving averages (5-raid, 10-raid windows)
  - Performance distribution histograms
  - Participation trends over time
- **Player Details** (`/player/[allycode]`): Individual player performance
- **Help** (`/help/`): Documentation and usage guide
- **About** (`/about/`): Project information