# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack portfolio website with two separate packages:

- **`Client/`** — Vite + React 19 frontend (SPA using HashRouter)
- **`Server/`** — Express.js backend API

Each has its own `node_modules` and `package.json`. Run commands from within their respective directories. This repository lives directly on the production host machine — Nginx serves the static frontend build and proxies `/api/` to the Express server (port 5000) managed by PM2.

## Commands

### Client (from `Client/`)
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Server (from `Server/`)
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

## Environment Variables

**Client** (`Client/.env`):
- `VITE_API_URL` — Backend base URL, e.g. `http://localhost:5000/api/`

**Server** (`.env` in `Server/`):
- `GHUB_TOKEN` — GitHub personal access token (used for commits/repos/snippet endpoints)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Email config for contact form
- `EMAIL_FROM`, `EMAIL_TO` — Sender/recipient for contact form emails
- `HIGHSCORES_FILE_PATH` — Optional override for highscores.json path (defaults to `Server/highscores.json`)
- `PORT` — Server port (defaults to 5000)

## Architecture

### Frontend routing
Uses `HashRouter` (not `BrowserRouter`). Routes: `/`, `/about`, `/projects`, `/contact`, `/redisTest`.

### API communication
All components that call the backend read `import.meta.env.VITE_API_URL` and append the endpoint path. The `VITE_API_URL` must include a trailing slash.

### Backend API endpoints
All endpoints are prefixed with `/api/`:
- `GET /commits` — Fetches recent commits across all public GitHub repos, filters out asset-only commits, returns top 10 with file contents
- `GET /snippet?url=<raw_url>` — Proxies raw file fetches; only allows URLs starting with `https://github.com/purabtpatel`
- `GET /repos` — Lists public GitHub repositories
- `GET /highscores` — Returns top 5 Snake game scores from `highscores.json`
- `POST /highscores` — Saves a new Snake game score (validates name/score, profanity filtered)
- `POST /contact` — Sends email via nodemailer; validates name, email, message length, blocks links and profanity
- `POST /track` — Logs page visit metadata to `/home/ubuntu/logs/traffic.log` (production log path hardcoded)

### Rate limiting
`/contact`: 50/hr, `/commits` and `/snippet` and `/repos`: 200/hr each.

### Project data
Projects are hardcoded as a static array in `Client/src/Components/ProjectPage/ProjectPage.jsx`. To add a new project, edit `allProjects` in that file.

### About page content
All bio text (experience, skills, hobbies, etc.) is hardcoded in `Client/src/Components/AboutPage/AboutPage.jsx` inside the `sections` object.

### Code showcase
`CodeShowcase` fetches recent commits from the backend and renders them as `CodeCard` components. `CodeCard` fetches raw file content via the `/api/snippet` proxy.
