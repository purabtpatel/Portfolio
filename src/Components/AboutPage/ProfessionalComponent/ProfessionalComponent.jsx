import React from 'react';
import './ProfessionalComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';

const ProfessionalComponent = () => {
    const [sectionSelected, setSectionSelected] = React.useState("experience");

    return (
        <div className="professional-component">
            <div className='info-selection'>
                <div className='info-selection-title'>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <h3>professional-info</h3>
                </div>
                <button className={`professional-button ${sectionSelected === "experience" ? "selected" : ""}`} onClick={() => setSectionSelected("experience")}>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={sectionSelected === "experience" ? faChevronDown : faChevronRight} />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faFolder} />
                    </div>
                    Experience 
                </button>
                <button className={`professional-button ${sectionSelected === "tech-skills" ? "selected" : ""}`} onClick={() => setSectionSelected("tech-skills")}>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={sectionSelected === "tech-skills" ? faChevronDown : faChevronRight} />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faFolder} />
                    </div>
                    Tech-Skills
                </button>
                <button className={`professional-button ${sectionSelected === "soft-skills" ? "selected" : ""}`} onClick={() => setSectionSelected("soft-skills")}>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={sectionSelected === "soft-skills" ? faChevronDown : faChevronRight} />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faFolder} />
                    </div>
                    Soft-Skills
                </button>
                <AboutContactsComponent />
            </div>
            <div className='info-content'>
                {sectionSelected === "experience" && (
                    <div className='experience-content'>
                        <h4>Experience</h4>
                        <p>Details about your experience...</p>
                    </div>
                )}
                {sectionSelected === "tech-skills" && (
                    <div className='tech-skills-content'>
                        <h4>Tech Skills</h4>
                        <p>Details about your tech skills...</p>
                    </div>
                )}
                {sectionSelected === "soft-skills" && (
                    <div className='soft-skills-content'>
                        <h4>Soft Skills</h4>
                        <p>Details about your soft skills...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalComponent;
