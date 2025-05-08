import { useEffect, useRef, useState, useCallback } from "react";
import './SnakeGame.css';

const CELL_SIZE = 10;
const BOARD_SIZE = 40;
const TICK_RATE = 55;
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE;


const PROFANITY_REGEX = /\b(fuck|shit|damn|ass|bitch|cunt|dick|piss|cock|bastard)\b/i;

function generateInitialSnake() {
    const startX = 20;
    const startY = 20;
    const initialLength = 5;
    const initialDirection = { x: 0, y: -1 };

    const snake = [];
    for (let i = 0; i < initialLength; i++) {
        snake.push({
            x: startX - initialDirection.x * i,
            y: startY - initialDirection.y * i,
        });
    }
    return snake;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
    };
}

const SnakeGame = ({ score, setScore, highscores, setHighscores, setDisplayInstructions }) => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState(generateInitialSnake());
    const [food, setFood] = useState(generateFood());
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [isRunning, setIsRunning] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const [error, setError] = useState(null);

    const latestDirection = useRef(direction);
    const latestFood = useRef(food);
    const latestSnake = useRef(snake);
    const pendingDirection = useRef(null);

    useEffect(() => {
        latestDirection.current = direction;
    }, [direction]);

    useEffect(() => {
        latestFood.current = food;
    }, [food]);

    useEffect(() => {
        latestSnake.current = snake;
    }, [snake]);

    // Fetch highscores on mount
    useEffect(() => {
        fetchHighscores();
    }, []);

    const fetchHighscores = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/highscores');
            if (!response.ok) throw new Error('Failed to fetch highscores');
            const data = await response.json();
            setHighscores(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching highscores:', error);
            setError('Failed to load leaderboard');
            setHighscores([]);
        }
    };

    const submitHighscore = async () => {
        if (!playerName.trim() || score <= 0) {
            setError('Please enter a valid name');
            return;
        }

        // Client-side profanity check
        if (PROFANITY_REGEX.test(playerName.trim())) {
            setError('Inappropriate name detected. Please choose a different name.');
            setPlayerName('');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/highscores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playerName.trim(), score }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit highscore');
            }

            const data = await response.json();
            setHighscores(Array.isArray(data) ? data : []);
            setShowNameInput(false);
            setPlayerName('');
            setError(null);
        } catch (error) {
            console.error('Error submitting highscore:', error);
            setError(error.message || 'Failed to submit score');
            // Keep showNameInput true to allow retry
        }
    };

    const handleStart = () => {
        const initialSnake = generateInitialSnake();
        const initialFood = generateFood();
        const initialDirection = { x: 0, y: -1 };

        setDisplayInstructions(false);
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection(initialDirection);
        latestSnake.current = initialSnake;
        latestFood.current = initialFood;
        latestDirection.current = initialDirection;
        pendingDirection.current = null;

        setScore(0);
        setIsRunning(true);
        setIsGameOver(false);
        setShowNameInput(false);
        setError(null);
    };

    // Handle keyboard input with debounced direction changes
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isRunning || isGameOver) return;

            const currentDirection = latestDirection.current;

            if (e.key === "ArrowUp" && currentDirection.y !== 1) {
                pendingDirection.current = { x: 0, y: -1 };
            } else if (e.key === "ArrowDown" && currentDirection.y !== -1) {
                pendingDirection.current = { x: 0, y: 1 };
            } else if (e.key === "ArrowLeft" && currentDirection.x !== 1) {
                pendingDirection.current = { x: -1, y: 0 };
            } else if (e.key === "ArrowRight" && currentDirection.x !== -1) {
                pendingDirection.current = { x: 1, y: 0 };
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isRunning, isGameOver]);

    // Pre-draw snake and food on initial load
    useEffect(() => {
        if (!canvasRef.current || isRunning || isGameOver) return;

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw food with shadow
        ctx.save();
        ctx.shadowColor = `rgba(67, 217, 173)`;
        ctx.shadowBlur = 20;
        ctx.fillStyle = `rgba(67, 217, 173)`;
        ctx.beginPath();
        ctx.arc(
            latestFood.current.x * CELL_SIZE + CELL_SIZE / 2,
            latestFood.current.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE * 0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        // Draw snake without shadow
        latestSnake.current.forEach((segment, index) => {
            const t = index / latestSnake.current.length;
            const minAlpha = 0.1;
            const alpha = 1 - t + minAlpha;
            ctx.fillStyle = `rgba(67, 217, 173, ${alpha})`;
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
    }, [snake, food, isRunning, isGameOver]);

    // Game loop with requestAnimationFrame
    useEffect(() => {
        if (!isRunning || isGameOver || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        let lastTick = performance.now();
        let animationFrameId;

        const gameLoop = (now) => {
            if (now - lastTick >= TICK_RATE) {
                const currentSnake = latestSnake.current;
                const currentDirection = pendingDirection.current || latestDirection.current;
                pendingDirection.current = null;

                const newHead = {
                    x: currentSnake[0].x + currentDirection.x,
                    y: currentSnake[0].y + currentDirection.y,
                };

                // Collision checks with optimized Set-based collision detection
                const snakeSet = new Set(currentSnake.slice(1).map(s => `${s.x},${s.y}`));
                if (
                    newHead.x < 0 ||
                    newHead.x >= BOARD_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= BOARD_SIZE ||
                    snakeSet.has(`${newHead.x},${newHead.y}`)
                ) {
                    setIsRunning(false);
                    setIsGameOver(true);
                    if (score > 0 && (highscores.length < 5 || score > Math.min(...highscores.map(h => h.score)))) {
                        setShowNameInput(true);
                    }
                    return;
                }

                let newSnake = [...currentSnake];
                let ateFood = false;

                if (newHead.x === latestFood.current.x && newHead.y === latestFood.current.y) {
                    ateFood = true;
                    newSnake.unshift(newHead);
                    latestFood.current = generateFood();
                    setFood(latestFood.current);
                    setScore((prev) => prev + 1);
                } else {
                    newSnake.unshift(newHead);
                    newSnake.pop();
                }

                latestSnake.current = newSnake;
                setSnake(newSnake);
                latestDirection.current = currentDirection;
                lastTick = now;
            }

            // Render
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            // Draw food with shadow
            ctx.save();
            ctx.shadowColor = `rgba(67, 217, 173)`;
            ctx.shadowBlur = 20;
            ctx.fillStyle = `rgba(67, 217, 173)`;
            ctx.beginPath();
            ctx.arc(
                latestFood.current.x * CELL_SIZE + CELL_SIZE / 2,
                latestFood.current.y * CELL_SIZE + CELL_SIZE / 2,
                CELL_SIZE * 0.4,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.restore();

            // Draw snake without shadow
            latestSnake.current.forEach((segment, index) => {
                const t = index / latestSnake.current.length;
                const minAlpha = 0.1;
                const alpha = 1 - t + minAlpha;
                ctx.fillStyle = `rgba(67, 217, 173, ${alpha})`;
                ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            });

            // Draw game over screen
            if (isGameOver) {
                ctx.fillStyle = `rgba(67, 217, 173)`;
                ctx.font = "bold 30px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Game Over!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
            }

            if (isRunning && !isGameOver) {
                animationFrameId = requestAnimationFrame(gameLoop);
            }
        };

        animationFrameId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isRunning, isGameOver, score, highscores, setScore, setDisplayInstructions]);

    return (
        <div>
            
            <div className="snake-board-wrapper">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="snake-canvas"
                />

                <div className="snake-buttons">
                    {!isRunning && !isGameOver && (
                        <button onClick={handleStart} className="snake-button start">
                            Start Game
                        </button>
                    )}
                    {isGameOver && !showNameInput && (
                        <button onClick={handleStart} className="snake-button restart">
                            Restart Game
                        </button>
                    )}
                    {showNameInput && (
                        <div className="highscore-input">
                            <h1>New Highscore!</h1>
                            {error && <div className="error-message">{error}</div>}
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                maxLength={8}
                            />
                            <button
                                onClick={submitHighscore}
                                disabled={!playerName.trim()}
                                className="snake-button submit"
                            >
                                Submit Score
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnakeGame;