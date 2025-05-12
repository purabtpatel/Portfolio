import React, { useState } from 'react';
import './HobbiesComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';

const HobbiesComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("finance");

    const textContent = {
        "finance": "I've been learning the ins and outs of the financial markets and instruments for around seven years now. \n I've found a special interest in cryptocurrency and the niche of trading options contracts.",
        "gaming": "From racing games to MOBAs, I enjoy gaming as a way to unwind, enjoy immersive storytelling, grow my strategic thinking skills and reflexes. Currently I'm most excited about the launch of GTA 6.\n\nSome of my most played and enjoyed games: \nLeague of Legends\nMinecraft\nNeed for Speed: Underground 2\nForza Horizon\nGTA 5\nRed Dead Redemption 2\nKerbal Space Program\n",
        "outdoors": "Hiking, biking, and spontaneous road trips keep me energized and connected to nature. I love playing sports like Volleyball, Badminton, and Basketball."
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
