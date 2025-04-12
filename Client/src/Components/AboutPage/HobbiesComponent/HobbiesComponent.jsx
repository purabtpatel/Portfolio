import React, { useState } from 'react';
import './HobbiesComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';

const HobbiesComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("music");

    const textContent = {
        "music": "I’ve been playing guitar and producing electronic music for several years. It’s a creative outlet that fuels both focus and flow...",
        "gaming": "From strategy games to immersive RPGs, I enjoy gaming as a way to relax and explore interactive storytelling...",
        "outdoors": "Hiking, biking, and spontaneous road trips keep me energized and connected to nature..."
    };

    return (
        <div className="hobbies-component">
            <div className="info-selection">
                <div className="info-selection-title">
                    <FontAwesomeIcon icon={faChevronDown} />
                    <h3>hobbies-info</h3>
                </div>
                {Object.keys(textContent).map((section, index) => (
                    <button
                        key={section}
                        className={`hobbies-button ${sectionSelected === section ? "selected" : ""}`}
                        onClick={() => setSectionSelected(section)}
                    >
                        <div className="arrow-icon">
                            <FontAwesomeIcon icon={sectionSelected === section ? faChevronDown : faChevronRight} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFolder} className={`folder-icon folder-${index}`} />
                        </div>
                        {section.replace("-", " ")}
                    </button>
                ))}
                <AboutContactsComponent />
            </div>

            <div className="info-content">
                <div className="info-content-header">
                    <span>hobbies-info</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className="info-content-body">
                    <CodeComment text={textContent[sectionSelected]} />
                </div>
            </div>
        </div>
    );
};

export default HobbiesComponent;
