import React, { useState } from 'react';
import './ProfessionalComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment'; // Updated to handle grid-based resizing

const ProfessionalComponent = () => {
    const [sectionSelected, setSectionSelected] = useState("experience");

    const textContent = {
        "experience": "Over the past two years, I have worked at NJ Courts as a junior developer supporting and upgrading internal applications used by staff at the courts. I have been involved in developing for both backend and frontend using Java and JSF. \nI also have lots of fun using JavaScript and libraries like React, and have built numerous  projects, including this portfolio site, using JavaScript. My go-to cloud provider is AWS, and I have a certified cloud practitioner certification with plans of expanding my skills with other AWS certifications. ",
        "tech-skills": "I am proficient in JavaScript, React, Node.js, Express, Java EE, JSF. I have experience administering and/or configuring AWS resources like EC2, S3, IAM, SES, Route 53. I also have a strong understanding of RESTful APIs and web services.",
        "soft-skills": "I bring strong problem-solving skills, teamwork, and communication to every project. I am adaptable, persistent, and always eager to learn and improve."
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
