# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Purab Patel. Frontend is React + Vite (`Client/`), backend is Express.js (`Server/`). This repository lives directly on the production host machine — Nginx serves the static frontend build and proxies `/api/` to the Express server (port 5000) managed by PM2.

## Commands

### Client (run from `Client/`)
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build to dist/
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Server (run from `Server/`)
```bash
npm run dev       # Start with nodemon (auto-reload)
npm start         # Start with node
```

### Production (run from anywhere)
```bash
pm2 restart portfolio-server   # Restart production server after changes
pm2 logs portfolio-server      # Tail server logs
pm2 status                     # Check process status
```

## Architecture

**Client (`Client/src/`)**
- `main.jsx` → `App.jsx`: Root entry. Uses `HashRouter` (not `BrowserRouter`) — this is intentional for static hosting compatibility.
- `App.jsx` fires a visitor tracking POST to `/api/track` on mount.
- All components live under `src/Components/`, organized by page: `HomePage`, `AboutPage`, `ProjectPage`, `ContactPage`, `RedisTestPage`.
- API base URL comes from `VITE_API_URL` env var (set to `http://localhost:5000/api/` locally).

**Server (`Server/server.js`)**
- Single-file Express server (ES modules).
- API endpoints:
  - `GET /api/repos` — proxies GitHub API for public repos
  - `GET /api/commits` — fetches recent commits across all public repos, filters to code-only files
  - `GET /api/snippet?url=` — proxies raw file content from GitHub (restricted to `github.com/purabtpatel` URLs only)
  - `POST /api/contact` — sends email via nodemailer/AWS SES
  - `GET/POST /api/highscores` — reads/writes `highscores.json` for the snake game leaderboard
  - `POST /api/track` — appends visitor logs to `/home/ubuntu/logs/traffic.log`
  - `GET /api/profile-photos` — serves static files from `uploads/`
- Per-endpoint rate limiting via `express-rate-limit`.

**About Page Code Showcase**
`CodeShowcase` → `CodeCard` → fetches snippet via `/api/snippet`. The server fetches commits from GitHub, filters out non-code files (CSS, MD, images, etc.), and returns up to 10 commits with their file URLs. The client then fetches raw file content through the `/api/snippet` proxy.
