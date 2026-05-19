Built from ground up with Vite + React.js for the frontend and Express.js for the backend. Design by https://www.behance.net/darelova

---

## Session Summary

### Infrastructure fixes
- Resolved CORS mismatch between `purabpatel.com` and `www.purabpatel.com` — added both origins to the Express CORS allowlist
- Added `highscoresReadLimiter` (60 req / 15 min) and `highscoresWriteLimiter` (10 req / 15 min) to `/api/highscores`, which previously had no rate limiting
- Removed a duplicate `GET /api/highscores` handler that was shadowed and never reached
- Created `deploy.sh` — builds the frontend and copies output to `/var/www/html`

### Frontend changes
- Removed the `/contact` page and its navbar link
- Fixed navbar layout regression (projects tab was floating right after contact removal)

### Pathfinding visualizer (replaced Snake game on home page)
The home page now features an interactive canvas-based pathfinding demo. Key properties:

- **Canvas**: 800×600, 40×30 grid, 20px cells
- **Maze generation**: random walls at ~28% density; regenerates until a valid path from start to end is guaranteed
- **Wall rendering**: teal border only on sides facing open cells — adjacent walls merge into solid shapes with a clean shared edge
- **Controls**: algorithm selector (← name →), Start / Randomize buttons overlaid on the canvas; overlay disappears during a run and reappears when done
- **Start** always clears the previous run's visuals before replaying on the same maze

Three algorithms implemented:

| Algorithm | Behavior |
|---|---|
| Breadth-First Search | Explores in expanding rings; always finds the shortest path |
| Depth-First Search | Follows corridors to dead ends then backtracks; dead-end cells are visually un-colored as the algorithm retreats |
| DFS (Shortest Path) | Exhaustive DFS with `onPath` cycle prevention, `bestLen` depth pruning, and `bestDist` DP memoization; explores all routes and returns the shortest one found |

Each algorithm has a configurable per-frame step rate and displays an explanation with a color legend in the overlay before the run starts.
