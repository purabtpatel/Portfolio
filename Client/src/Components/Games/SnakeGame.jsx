import { useEffect, useRef, useState } from "react";
import './SnakeGame.css'; // 👈 import the new CSS

const CELL_SIZE = 10;
const BOARD_SIZE = 40;
const TICK_RATE = 75;
;

function generateInitialSnake() {
    const startX = 20;
    const startY = 20;
    const initialLength = 5;
    const initialDirection = { x: 0, y: -1 }; // Moving upward

    const snake = [];
    for (let i = 0; i < initialLength; i++) {
        snake.push({
            x: startX - initialDirection.x * i,
            y: startY - initialDirection.y * i,
        });
    }
    return snake;
}


export default function SnakeGameCard() {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState(generateInitialSnake());
    const [food, setFood] = useState(generateFood);
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    function generateFood() {
        return {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    }

    const handleStart = () => {
        setSnake(generateInitialSnake());
        setFood(generateFood());
        setDirection({ x: 0, y: -1 });
        setScore(0);
        setIsRunning(true);
        setIsGameOver(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isRunning) return;
            if (e.key === "ArrowUp" && direction.y !== 1) setDirection({ x: 0, y: -1 });
            if (e.key === "ArrowDown" && direction.y !== -1) setDirection({ x: 0, y: 1 });
            if (e.key === "ArrowLeft" && direction.x !== 1) setDirection({ x: -1, y: 0 });
            if (e.key === "ArrowRight" && direction.x !== -1) setDirection({ x: 1, y: 0 });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction, isRunning]);

    useEffect(() => {
        if (!isRunning) return;

        const intervalId = setInterval(() => {
            setSnake((prevSnake) => {
                const newHead = {
                    x: prevSnake[0].x + direction.x,
                    y: prevSnake[0].y + direction.y,
                };

                if (
                    newHead.x < 0 ||
                    newHead.x >= BOARD_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= BOARD_SIZE ||
                    prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
                ) {
                    setIsRunning(false);
                    setIsGameOver(true);
                    return prevSnake;
                }

                let newSnake;
                if (newHead.x === food.x && newHead.y === food.y) {
                    newSnake = [newHead, ...prevSnake];
                    setFood(generateFood());
                    setScore((prev) => prev + 1);
                } else {
                    newSnake = [newHead, ...prevSnake.slice(0, -1)];
                }

                return newSnake;
            });
        }, TICK_RATE);

        return () => clearInterval(intervalId);
    }, [direction, food, isRunning]);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

        
        ctx.save(); 

        ctx.shadowColor = "#f87171";    // Red glow
        ctx.shadowBlur = 20;            // Adjust glow strength
        ctx.fillStyle = "#f87171";      // Fill color (solid)
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE * 0.4, 
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();

        snake.forEach((segment, index) => {
            const t = index / snake.length; 
            const minAlpha = 0.3;
            const alpha = Math.max(1 - t, minAlpha); ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`; // Green with dynamic alpha
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });


        if (isGameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);
            ctx.fillStyle = "#43d9ad"
            ctx.font = "bold 24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", (BOARD_SIZE * CELL_SIZE) / 2, (BOARD_SIZE * CELL_SIZE) / 2);
        }
    }, [snake, food, isGameOver]);

    return (
        <div className="snake-card">
            <p className="snake-score">Score: {score}</p>

            <div className="snake-board-wrapper">
                <canvas
                    ref={canvasRef}
                    width={BOARD_SIZE * CELL_SIZE}
                    height={BOARD_SIZE * CELL_SIZE}
                    className="snake-canvas"
                />
            </div>

            <div className="snake-buttons">
                {!isRunning && !isGameOver && (
                    <button onClick={handleStart} className="snake-button start">
                        Start Game
                    </button>
                )}
                {isGameOver && (
                    <button onClick={handleStart} className="snake-button restart">
                        Restart Game
                    </button>
                )}
            </div>
        </div>
    );
}
