import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faUser, faGamepad } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css'; // Assuming you have a CSS file for styling
import ProfessionalComponent from './ProfessionalComponent/ProfessionalComponent';
import CodeShowcase from './CodeSnippet/CodeShowcase';
import PersonalComponent from './PersonalComponent/PersonalComponent';
import HobbiesComponent from './HobbiesComponent/HobbiesComponent';


const AboutPage = () => {
    const [activeSection, setActiveSection] = useState("terminal");

    return (
      <div className="about-container">
        <div className="button-column">
          <button
            className={activeSection === "terminal" ? "button active" : "button"}
            onClick={() => setActiveSection("terminal")}
          >
            <FontAwesomeIcon icon={faTerminal} size="lg" />
          </button>
          <button
            className={activeSection === "user" ? "button active" : "button"}
            onClick={() => setActiveSection("user")}
          >
            <FontAwesomeIcon icon={faUser} size="lg" />
          </button>
          <button
            className={activeSection === "gamepad" ? "button active" : "button"}
            onClick={() => setActiveSection("gamepad")}
          >
            <FontAwesomeIcon icon={faGamepad} size="lg" />
          </button>
        </div>
        <div className='content-column'>
            {activeSection === "terminal" && (
                <ProfessionalComponent />
            )}
            {activeSection === "user" && (
                <PersonalComponent />
            )}
            {activeSection === "gamepad" && (
              <HobbiesComponent />
            )}
        </div>
        <div className='code-snippet'>
          <CodeShowcase />
        </div>
            
      </div>
    );
};

export default AboutPage;