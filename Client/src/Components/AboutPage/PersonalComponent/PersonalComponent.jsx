import React, { useState } from 'react';
import './PersonalComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';

const PersonalComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("hobbies");

    const textContent = {
        "hobbies": "In my free time, I enjoy learning about financial markets and instruments, gaming with my friends, and spending time outdoors and exploring nature.",
        "values": "Integrity, having curiosity in everything I do, strong moral compass. A few motos and life lessons I hold myself to: Growth is not linear. The harder you work, the luckier you get. Never criticize, condemn, or complain.",
        "goals": "I believe that materialistic goals are strong impulsive drivers but also equally as shallow. So I use short term materialistic goals to make progress towards more meaningful goals like becoming a better person, spiritually, physically, and emotionally."
    };

    return (
        <div className="personal-component">
            <div className="info-selection">
                <div className="info-selection-title">
                    <FontAwesomeIcon icon={faChevronDown} />
                    <h3>personal-info</h3>
                </div>
                {Object.keys(textContent).map((section, index) => (
                    <button
                        key={section}
                        className={`personal-button ${sectionSelected === section ? "selected" : ""}`}
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
                    <span>personal-info</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className="info-content-body">
                    <CodeComment text={textContent[sectionSelected]} />
                </div>
            </div>
        </div>
    );
};

export default PersonalComponent;
