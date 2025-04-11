import React, { useState } from 'react';
import './ProfessionalComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment'; // Updated to handle grid-based resizing

const ProfessionalComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("experience");

    const textContent = {
        "experience": "Over the past 5 years, I have worked on multiple projects involving front-end and back-end technologies. I specialize in React, JavaScript, and UI/UX design...",
        "tech-skills": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n \n Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. a front-end developer, I have experience in JavaScript, React, HTML, CSS, and modern frameworks. I focus on performance, accessibility, and creating seamless user experiences...",
        "soft-skills": "I bring strong problem-solving skills, teamwork, and communication to every project. I am adaptable, detail-oriented, and always eager to learn and improve..."
    };

    return (
        <div className="professional-component">
            <div className="info-selection">
                <div className="info-selection-title">
                    <FontAwesomeIcon icon={faChevronDown} />
                    <h3>professional-info</h3>
                </div>
                {Object.keys(textContent).map((section, index) => (
                    <button
                        key={section}
                        className={`professional-button ${sectionSelected === section ? "selected" : ""}`}
                        onClick={() => setSectionSelected(section)}
                    >
                        <div className="arrow-icon">
                            <FontAwesomeIcon icon={sectionSelected === section ? faChevronDown : faChevronRight} />
                        </div>
                        <div className="">
                            <FontAwesomeIcon icon={faFolder} className={`folder-icon folder-${index}`} />
                        </div>
                        {section.replace("-", " ")}
                    </button>
                ))}
                <AboutContactsComponent />
            </div>

            <div className="info-content">
                <div className="info-content-header">
                    <span>professional-info</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className="info-content-body">
                    <CodeComment text={textContent[sectionSelected]} />
                </div>
            </div>
        </div>
    );
};

export default ProfessionalComponent;
