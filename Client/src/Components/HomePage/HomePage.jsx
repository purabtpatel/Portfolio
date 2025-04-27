import React, { useState } from 'react';
import SnakeGame from '../Games/SnakeGame';
import './HomePage.css';

const HomePage = () => {
    const [score, setScore] = useState(0);
    
    return (
        <div className="game-card">
            <p>Score: {score}</p>
            <SnakeGame 
            score={score} 
            setScore={setScore} 
            />
        </div>
    );
};

export default HomePage;