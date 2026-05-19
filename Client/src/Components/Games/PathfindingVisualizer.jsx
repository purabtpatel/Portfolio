import { useEffect, useRef, useState } from 'react';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PathfindingVisualizer.css';

const CELL_SIZE = 20;
const GRID_COLS = 40;
const GRID_ROWS = 30;
const CANVAS_W = 800;
const CANVAS_H = 600;
const WALL_DENSITY = 0.28;
const START = [0, 0];
const END = [GRID_ROWS - 1, GRID_COLS - 1];

// Cap so exhaustive DFS doesn't pre-compute forever on adversarial mazes
const MAX_OPS = 300000;

const COLOR_OPEN        = '#111a2b';
const COLOR_WALL        = '#1c2a3e';
const COLOR_WALL_BORDER = 'rgba(67,217,173,0.55)';
const COLOR_START       = 'rgba(67,217,173,1)';
const COLOR_END         = '#f0a500';
const COLOR_VISITED     = 'rgba(67,217,173,0.3)';
const COLOR_PATH        = 'rgba(67,217,173,0.95)';

function hasPath(walls) {
    const startKey = `${START[0]},${START[1]}`;
    const endKey   = `${END[0]},${END[1]}`;
    const visited  = new Set([startKey]);
    const queue    = [startKey];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current === endKey) return true;
        const [r, c] = current.split(',').map(Number);
        for (const [nr, nc] of getNeighbors(r, c, walls)) {
            const nk = `${nr},${nc}`;
            if (!visited.has(nk)) { visited.add(nk); queue.push(nk); }
        }
    }
    return false;
}

function generateWalls() {
    while (true) {
        const walls = new Set();
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                if (r === START[0] && c === START[1]) continue;
                if (r === END[0]   && c === END[1])   continue;
                if (Math.random() < WALL_DENSITY) walls.add(`${r},${c}`);
            }
        }
        if (hasPath(walls)) return walls;
    }
}

function getNeighbors(r, c, walls) {
    return [[-1,0],[1,0],[0,-1],[0,1]]
        .map(([dr, dc]) => [r + dr, c + dc])
        .filter(([nr, nc]) =>
            nr >= 0 && nr < GRID_ROWS &&
            nc >= 0 && nc < GRID_COLS &&
            !walls.has(`${nr},${nc}`)
        );
}

function reconstructPath(cameFrom, endKey) {
    const path = [];
    let current = endKey;
    while (cameFrom.has(current)) {
        path.unshift(current.split(',').map(Number));
        current = cameFrom.get(current);
    }
    if (path.length > 0) path.unshift(START);
    return path;
}

function runBFS(walls) {
    const startKey = `${START[0]},${START[1]}`;
    const endKey   = `${END[0]},${END[1]}`;
    const queue    = [startKey];
    const visited  = new Set([startKey]);
    const cameFrom = new Map();
    const operations = [];

    while (queue.length > 0) {
        const current = queue.shift();
        operations.push({ type: 'visit', cell: current.split(',').map(Number) });
        if (current === endKey) break;
        const [r, c] = current.split(',').map(Number);
        for (const [nr, nc] of getNeighbors(r, c, walls)) {
            const nk = `${nr},${nc}`;
            if (!visited.has(nk)) {
                visited.add(nk);
                cameFrom.set(nk, current);
                queue.push(nk);
            }
        }
    }

    const path = visited.has(endKey) ? reconstructPath(cameFrom, endKey) : [];
    return { operations, path };
}

// Stops at first path found; shows backtracking clearly.
function runDFS(walls) {
    const startKey = `${START[0]},${START[1]}`;
    const endKey   = `${END[0]},${END[1]}`;
    const visited  = new Set([startKey]);
    const cameFrom = new Map();
    const operations = [{ type: 'visit', cell: START }];

    const stack = [[startKey, 0, getNeighbors(START[0], START[1], walls).map(([nr,nc]) => `${nr},${nc}`)]];
    let found = false;

    while (stack.length > 0 && !found) {
        const frame = stack[stack.length - 1];
        const [key, , neighbors] = frame;
        let advanced = false;

        while (frame[1] < neighbors.length) {
            const nk = neighbors[frame[1]++];
            if (!visited.has(nk)) {
                visited.add(nk);
                cameFrom.set(nk, key);
                const cell = nk.split(',').map(Number);
                operations.push({ type: 'visit', cell });
                if (nk === endKey) { found = true; break; }
                const [nr, nc] = cell;
                stack.push([nk, 0, getNeighbors(nr, nc, walls).map(([nnr,nnc]) => `${nnr},${nnc}`)]);
                advanced = true;
                break;
            }
        }

        if (!advanced && !found) {
            stack.pop();
            if (key !== startKey) {
                operations.push({ type: 'unvisit', cell: key.split(',').map(Number) });
            }
        }
    }

    const path = found ? reconstructPath(cameFrom, endKey) : [];
    return { operations, path };
}

// Exhaustive DFS: uses onPath (not global visited) so every route can be explored.
// Prunes any branch whose current depth already meets or exceeds the best path found.
// Finds the shortest path at the cost of more exploration.
function runDFSShortest(walls) {
    const startKey  = `${START[0]},${START[1]}`;
    const endKey    = `${END[0]},${END[1]}`;
    const operations = [{ type: 'visit', cell: START }];

    let bestLen  = Infinity;
    let bestPath = [];

    const onPath   = new Set([startKey]);
    const bestDist = new Map([[startKey, 0]]); // minimum depth at which each cell was reached
    const stack    = [[START[0], START[1], startKey, 0,
                       getNeighbors(START[0], START[1], walls).map(([nr,nc]) => `${nr},${nc}`)]];

    while (stack.length > 0 && operations.length < MAX_OPS) {
        const frame = stack[stack.length - 1];
        const [r, c, key, , neighbors] = frame;

        // Can't beat bestLen from here — exhaust this frame immediately.
        if (stack.length + 1 >= bestLen) {
            frame[3] = neighbors.length;
        }

        let advanced = false;
        while (frame[3] < neighbors.length) {
            const nk = neighbors[frame[3]++];
            if (onPath.has(nk)) continue;

            // DP: skip if we've already reached nk via an equally short or shorter path.
            // Only re-explore when we find a strictly shorter route to this cell.
            const nkDepth = stack.length;
            if ((bestDist.get(nk) ?? Infinity) <= nkDepth) continue;
            bestDist.set(nk, nkDepth);

            const [nr, nc] = nk.split(',').map(Number);

            if (nk === endKey) {
                // Path length = stack depth + 1 step to end
                if (stack.length + 1 < bestLen) {
                    bestLen  = stack.length + 1;
                    bestPath = stack.map(([fr, fc]) => [fr, fc]).concat([[nr, nc]]);
                }
                // Don't push end onto stack; keep searching for shorter paths
            } else {
                onPath.add(nk);
                operations.push({ type: 'visit', cell: [nr, nc] });
                stack.push([nr, nc, nk, 0,
                            getNeighbors(nr, nc, walls).map(([nnr,nnc]) => `${nnr},${nnc}`)]);
                advanced = true;
                break;
            }
        }

        if (!advanced) {
            stack.pop();
            onPath.delete(key);
            if (key !== startKey) {
                operations.push({ type: 'unvisit', cell: [r, c] });
            }
        }
    }

    return { operations, path: bestPath };
}

const ALGORITHMS = [
    {
        label: 'Breadth-First Search',
        run: runBFS,
        opsPerFrame: 4,
        pathPerFrame: 3,
        description: [
            'Explores cells in expanding rings outward from the start — like ripples in water.',
            'Every cell one step away is visited before any cell two steps away.',
            'Always finds the shortest route through the maze when one exists.',
        ],
    },
    {
        label: 'Depth-First Search',
        run: runDFS,
        opsPerFrame: 2,
        pathPerFrame: 2,
        description: [
            'Follows one corridor as deep as possible before backtracking.',
            'Dead-end branches are un-colored as the algorithm retreats.',
            'Finds a route if one exists, but not necessarily the shortest.',
        ],
    },
    {
        label: 'DFS (Shortest Path)',
        run: runDFSShortest,
        opsPerFrame: 15,
        pathPerFrame: 2,
        description: [
            'Exhaustive DFS: explores every possible route, backtracking from dead ends.',
            'Prunes any branch that cannot beat the shortest path found so far.',
            'Guaranteed to find the shortest path — at the cost of much more exploration.',
        ],
    },
];

const LEGEND = [
    { color: COLOR_START,   label: 'Start' },
    { color: COLOR_END,     label: 'End' },
    { color: COLOR_VISITED, label: 'Visited' },
    { color: COLOR_PATH,    label: 'Path' },
    { color: COLOR_WALL,    label: 'Wall', border: true },
];

const PathfindingVisualizer = () => {
    const [algoIndex, setAlgoIndex] = useState(2);
    const [isRunning, setIsRunning] = useState(false);
    const [walls, setWalls]         = useState(() => generateWalls());

    const canvasRef         = useRef(null);
    const animRef           = useRef(null);
    const wallsRef          = useRef(walls);
    const lastCycleTime     = useRef(0);
    const lastRandomizeTime = useRef(0);

    useEffect(() => { wallsRef.current = walls; }, [walls]);

    function drawCell(ctx, r, c, color) {
        ctx.fillStyle = color;
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    function drawWall(ctx, r, c, wallsSnapshot) {
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;
        ctx.fillStyle = COLOR_WALL;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        ctx.strokeStyle = COLOR_WALL_BORDER;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (!wallsSnapshot.has(`${r-1},${c}`)) { ctx.moveTo(x + 0.5, y + 0.5);              ctx.lineTo(x + CELL_SIZE - 0.5, y + 0.5); }
        if (!wallsSnapshot.has(`${r+1},${c}`)) { ctx.moveTo(x + 0.5, y + CELL_SIZE - 0.5);  ctx.lineTo(x + CELL_SIZE - 0.5, y + CELL_SIZE - 0.5); }
        if (!wallsSnapshot.has(`${r},${c-1}`)) { ctx.moveTo(x + 0.5, y + 0.5);              ctx.lineTo(x + 0.5, y + CELL_SIZE - 0.5); }
        if (!wallsSnapshot.has(`${r},${c+1}`)) { ctx.moveTo(x + CELL_SIZE - 0.5, y + 0.5);  ctx.lineTo(x + CELL_SIZE - 0.5, y + CELL_SIZE - 0.5); }
        ctx.stroke();
    }

    function drawFullGrid(wallsSnapshot) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const key = `${r},${c}`;
                if (wallsSnapshot.has(key))                    drawWall(ctx, r, c, wallsSnapshot);
                else if (r === START[0] && c === START[1])     drawCell(ctx, r, c, COLOR_START);
                else if (r === END[0]   && c === END[1])       drawCell(ctx, r, c, COLOR_END);
                else                                           drawCell(ctx, r, c, COLOR_OPEN);
            }
        }
    }

    function drawPath(ctx, r, c) {
        if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) return;
        ctx.fillStyle = COLOR_PATH;
        ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    useEffect(() => {
        if (!canvasRef.current) return;
        drawFullGrid(walls);
    }, [walls]);

    useEffect(() => {
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, []);

    function handleCycleAlgo(direction) {
        const now = Date.now();
        if (now - lastCycleTime.current < 200) return;
        lastCycleTime.current = now;
        setAlgoIndex(i => (i + direction + ALGORITHMS.length) % ALGORITHMS.length);
    }

    function handleRandomize() {
        const now = Date.now();
        if (now - lastRandomizeTime.current < 500) return;
        lastRandomizeTime.current = now;

        if (animRef.current) {
            cancelAnimationFrame(animRef.current);
            animRef.current = null;
        }
        setIsRunning(false);
        const newWalls = generateWalls();
        wallsRef.current = newWalls;
        setWalls(newWalls);
    }

    function handleStart() {
        setIsRunning(true);
        drawFullGrid(wallsRef.current);

        const { opsPerFrame, pathPerFrame } = ALGORITHMS[algoIndex];
        const { operations, path } = ALGORITHMS[algoIndex].run(wallsRef.current);
        const ctx = canvasRef.current.getContext('2d');
        let opIdx = 0;

        const animateOps = () => {
            for (let i = 0; i < opsPerFrame && opIdx < operations.length; i++) {
                const { type, cell: [r, c] } = operations[opIdx++];
                if ((r === START[0] && c === START[1]) || (r === END[0] && c === END[1])) continue;
                if (type === 'visit') {
                    ctx.fillStyle = COLOR_VISITED;
                    ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                } else {
                    ctx.fillStyle = COLOR_OPEN;
                    ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
            if (opIdx < operations.length) {
                animRef.current = requestAnimationFrame(animateOps);
            } else {
                let pathIdx = 0;
                const animatePath = () => {
                    for (let i = 0; i < pathPerFrame && pathIdx < path.length; i++) {
                        const [r, c] = path[pathIdx++];
                        drawPath(ctx, r, c);
                    }
                    if (pathIdx < path.length) {
                        animRef.current = requestAnimationFrame(animatePath);
                    } else {
                        animRef.current = null;
                        setIsRunning(false);
                    }
                };
                animRef.current = requestAnimationFrame(animatePath);
            }
        };

        animRef.current = requestAnimationFrame(animateOps);
    }

    const algo = ALGORITHMS[algoIndex];

    return (
        <div className="pf-board-wrapper">
            {!isRunning && (
                <div className="pf-overlay">
                    <div className="pf-algo-row">
                        <button className="arrow-button" onClick={() => handleCycleAlgo(-1)}>
                            <FontAwesomeIcon icon={faCaretLeft} />
                        </button>
                        <span className="pf-algo-label">{algo.label}</span>
                        <button className="arrow-button" onClick={() => handleCycleAlgo(+1)}>
                            <FontAwesomeIcon icon={faCaretRight} />
                        </button>
                    </div>

                    <div className="pf-description">
                        {algo.description.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>

                    <div className="pf-legend">
                        {LEGEND.map(({ color, label, border }) => (
                            <span key={label} className="pf-legend-item">
                                <span
                                    className="pf-legend-dot"
                                    style={{ background: color, border: border ? '1px solid #334' : 'none' }}
                                />
                                {label}
                            </span>
                        ))}
                    </div>

                    <div className="pf-action-row">
                        <button className="pf-btn" onClick={handleStart}>Start</button>
                        <button className="pf-btn pf-btn-secondary" onClick={handleRandomize}>Randomize</button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="pf-canvas" />
        </div>
    );
};

export default PathfindingVisualizer;
