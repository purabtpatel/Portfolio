import React from 'react';
import PathfindingVisualizer from '../Games/PathfindingVisualizer';
import './HomePage.css';

const HomePage = () => {
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
                    <span className="home-page-comments">// watch the algorithm find the path:</span>
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

                    <PathfindingVisualizer />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
