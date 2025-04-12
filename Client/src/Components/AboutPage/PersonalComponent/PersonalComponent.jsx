import React, { useState } from 'react';
import './PersonalComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';

const PersonalComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("hobbies");

    const textContent = {
        "hobbies": "In my free time, I enjoy playing music, experimenting with generative art, and exploring nature through hiking and travel...",
        "values": "Integrity, curiosity, and empathy guide my personal and professional life. I strive to bring positivity and purpose to all I do...",
        "goals": "I’m always working towards becoming a more thoughtful creator and a well-rounded person. Personal growth and continuous learning are central to my journey..."
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
