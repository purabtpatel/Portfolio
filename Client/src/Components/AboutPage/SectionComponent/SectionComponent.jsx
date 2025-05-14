import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Button, Menu, MenuItem } from '@mui/material';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';
import './SectionComponent.css';
import CLFC02 from './Certifications/aws-certified-cloud-practitioner.png';


const certificationsMap = {
    'https://www.credly.com/badges/4bdb986b-7e24-42e2-8662-d485faf3c40b/public_url': CLFC02
};

const SectionComponent = ({ sectionName, textContent, classPrefix }) => {
    const [sectionSelected, setSectionSelected] = useState(Object.keys(textContent)[0] || '');

    const contactHeader = 'Contact me';
    const contactList = [
        'Email: purabtpatel@gmail.com',
        'Phone: +1 (732)692-3419',
    ];

    useEffect(() => {
        setSectionSelected(Object.keys(textContent)[0] || '');
    }, [textContent]);

    return (
        <div className={`${classPrefix}-component`}>
            <div className="info-selection">
                <div className="info-selection-title">
                    <FontAwesomeIcon icon={faChevronDown} />
                    <h3>{sectionName}-info</h3>
                </div>
                {Object.keys(textContent).map((section, index) => (
                    <button
                        key={section}
                        className={`${classPrefix}-button ${sectionSelected === section ? 'selected' : ''}`}
                        onClick={() => setSectionSelected(section)}
                    >
                        <div className="arrow-icon">
                            <FontAwesomeIcon icon={sectionSelected === section ? faChevronDown : faChevronRight} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faFolder} className={`folder-icon folder-${index}`} />
                        </div>
                        {section.replace('-', ' ')}
                    </button>
                ))}
                <div className="resume-download">
                    <a
                        href=""
                        download
                        className={`${classPrefix}-button`}
                        style={{ textDecoration: 'none', display:'none' }}
                        
                    >
                        <div className="arrow-icon">
                            <FontAwesomeIcon icon={faFileArrowDown} size="lg" />
                        </div>
                        Download Resume
                    </a>
                </div>
                <AboutContactsComponent header={contactHeader} list={contactList} />
            </div>
            <div className="info-content">
                <div className="info-content-header">
                    <span>{sectionName}/{sectionSelected}</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                {sectionSelected === 'certifications' && (
                    <div className="certification-list">
                        {Object.entries(certificationsMap).map(([link, fileName], index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="certification-link"
                              >
                                <div className='photo-card' style={{ backgroundImage: `url(${fileName})` }}>
                               </div>
                              </a>
                            
                            
                        ))}
                    </div>
                )}
                {sectionSelected !== 'certifications' && (
                    <div className="info-content-body">
                        <CodeComment text={textContent[sectionSelected]} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectionComponent;