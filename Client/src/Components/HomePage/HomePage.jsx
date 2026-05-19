import React from 'react';
import './HomePage.css';

const SaphFi = "https://saphfi.ai/";

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
                    <span className="home-page-comments">// Check out my latest project:</span>
                    <span className="home-page-comments">// train your own ML model</span>
                    <div className="home-page-code">
                        <span className="home-page-const">const </span>
                        <span className="home-page-variable">SaphFi</span>
                        <span> = </span>
                        <a href={SaphFi} target="_blank" rel="noopener noreferrer" className="home-page-link">{SaphFi}</a>
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

                    <a href={SaphFi} target="_blank" rel="noopener noreferrer" className="saphfi-display">
                        <span className="rail-logo-name" style={{ color: '#f7f9ff' }}>
                            Saph<span style={{ color: '#d2b9f0f2' }}>Fi</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
