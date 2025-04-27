import { useEffect, useRef, useState, useCallback } from "react";
import './SnakeGame.css';

const CELL_SIZE = 10;
const BOARD_SIZE = 40;
const TICK_RATE = 75;


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


export default function SnakeGameCard() {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState(generateInitialSnake());
    const [food, setFood] = useState(generateFood);
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const latestDirection = useRef(direction);
    const latestFood = useRef(food);
    const latestSnake = useRef(snake);

    useEffect(() => {
        latestDirection.current = direction;
    }, [direction]);

    useEffect(() => {
        latestFood.current = food;
    }, [food]);

    useEffect(() => {
        latestSnake.current = snake;
    }, [snake]);


    const handleStart = () => {
        const initialSnake = generateInitialSnake();
        const initialFood = generateFood();
        const initialDirection = { x: 0, y: -1 };

        setSnake(initialSnake);
        setFood(initialFood);
        setDirection(initialDirection);
        latestSnake.current = initialSnake;
        latestFood.current = initialFood;
        latestDirection.current = initialDirection;

        setScore(0);
        setIsRunning(true);
        setIsGameOver(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isRunning || isGameOver) return;

            const currentDirection = latestDirection.current;

            if (e.key === "ArrowUp" && currentDirection.y !== 1) setDirection({ x: 0, y: -1 });
            else if (e.key === "ArrowDown" && currentDirection.y !== -1) setDirection({ x: 0, y: 1 });
            else if (e.key === "ArrowLeft" && currentDirection.x !== 1) setDirection({ x: -1, y: 0 });
            else if (e.key === "ArrowRight" && currentDirection.x !== -1) setDirection({ x: 1, y: 0 });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isRunning, isGameOver]);

    const runGameTick = useCallback(() => {
        const currentSnake = latestSnake.current;
        const currentDirection = latestDirection.current;
        const currentFood = latestFood.current;

        const newHead = {
            x: currentSnake[0].x + currentDirection.x,
            y: currentSnake[0].y + currentDirection.y,
        };

        if (
            newHead.x < 0 ||
            newHead.x >= BOARD_SIZE ||
            newHead.y < 0 ||
            newHead.y >= BOARD_SIZE
        ) {
            setIsRunning(false);
            setIsGameOver(true);
            return;
        }

         const willCollide = currentSnake.slice(1).some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
         );
         if (willCollide) {
              setIsRunning(false);
              setIsGameOver(true);
              return;
         }


        let newSnake = [...currentSnake];
        let ateFood = false;

        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            ateFood = true;
            newSnake.unshift(newHead);
            setFood(generateFood());
            setScore((prev) => prev + 1);

        } else {
             newSnake.unshift(newHead);
             newSnake.pop();
        }

        setSnake(newSnake);

    }, []);

    useEffect(() => {
        if (!isRunning || isGameOver) {
            return;
        }

        const intervalId = setInterval(runGameTick, TICK_RATE);

        return () => clearInterval(intervalId);
    }, [isRunning, isGameOver, runGameTick]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

        ctx.save();
        ctx.shadowColor = "#f87171";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#f87171";
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
            const alpha = Math.max(1 - t, minAlpha);
            ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });


        if (isGameOver) {
             ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
             ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

             ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const centerX = (BOARD_SIZE * CELL_SIZE) / 2;
            const centerY = (BOARD_SIZE * CELL_SIZE) / 2;

            ctx.fillText("Game Over!", centerX, centerY - 20);
            ctx.font = "bold 20px Arial";
            ctx.fillText(`Final Score: ${score}`, centerX, centerY + 20);
        }
    }, [snake, food, isGameOver, score]);

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