import React, { useState } from 'react';
import SnakeGame from '../Games/SnakeGame';
import InvasionGame from '../Games/InvasionGame';
import './HomePage.css';

const HomePage = () => {
    const [score, setScore] = useState(0);

    return (
        <div className="home-page">
            <div className="home-page-content">
                <div className="home-page-header">

                    <span>Hi all, I'm</span>
                    <h1 className="home-page-title">Purab Patel</h1>
                    <span className="blue-text">
                        <span className="blue-text-symbol">&gt;</span>
                        <h2>&nbsp;Full-stack developer</h2>
                    </span>
                </div>
                <div className="home-page-info">
                    <span className="home-page-comments">// try some games: </span>
                    <span className="home-page-comments">// you can see the code on my Github</span>
                    <div className="home-page-code">
                        <span className="home-page-const">const </span>
                        <span className="home-page-variable">githubLink</span>
                        <span> = </span>
                        <a href="https://github.com/purabtpatel" target="_blank" rel="noopener noreferrer" className="home-page-link">https://github.com/purabtpatel</a>
                    </div>
                </div>
            </div>
            <div className="game-card">
                <p>Score: {score}</p>
                <InvasionGame
                    score={score}
                    setScore={setScore}
                />
            </div>
        </div>
    );
};

export default HomePage;