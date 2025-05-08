import React, { useState } from 'react';
import SnakeGame from '../Games/SnakeGame';
import { faCaretUp, faCaretDown, faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './HomePage.css';

const HomePage = () => {
    const [score, setScore] = useState(0);
    const [highscores, setHighscores] = useState([]);
    const [displayInstructions, setDisplayInstructions] = useState(true);

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
                    <span className="home-page-comments">// try to set a highscore: </span>
                    <span className="home-page-comments">// you can see the code on my Github</span>
                    <div className="home-page-code">
                        <span className="home-page-const">const </span>
                        <span className="home-page-variable">githubLink</span>
                        <span> = </span>
                        <a href="https://github.com/purabtpatel" target="_blank" rel="noopener noreferrer" className="home-page-link">https://github.com/purabtpatel</a>
                    </div>
                </div>
            </div>
            <div className="relative-container" style={{ position: 'relative' }}>
                <div className="css-blurry-gradient-blue"></div>
                <div className="css-blurry-gradient-green"></div>

                <div className="game-card" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="screw top-left">X</div>
                    <div className="screw top-right">X</div>
                    <div className="screw bottom-left">X</div>
                    <div className="screw bottom-right">X</div>

                    <SnakeGame
                        setScore={setScore}
                        score={score}
                        highscores={highscores}
                        setHighscores={setHighscores}
                        setDisplayInstructions={setDisplayInstructions}
                    />

                    <div className="column-two">
                        <div className="how-to-play-panel">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div className="how-to-play-comments">// use your arrow</div>
                                <div className="how-to-play-comments">// keys to play</div>
                            </div>
                            <div className="arrow-keys">
                                <div className="arrow-row">
                                    <button className="arrow-button">
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    </button>
                                </div>
                                <div className="arrow-row">
                                    <button className="arrow-button">
                                        <FontAwesomeIcon icon={faCaretLeft} />
                                    </button>
                                    <button className="arrow-button">
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </button>
                                    <button className="arrow-button">
                                        <FontAwesomeIcon icon={faCaretRight} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="game-status-panel">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <h2 style={{paddingInline: '20px'}}>Score:</h2>
                                <h3 className="game-status-text">{score}</h3>
                            </div>
                        </div>

                        <div className="leaderboard">
                            <h2>Leaderboard</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {highscores.map((hs, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{hs.name}</td>
                                            <td>{hs.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;