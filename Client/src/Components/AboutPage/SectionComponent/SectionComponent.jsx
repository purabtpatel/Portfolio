import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';
import AboutContactsComponent from '../AboutContactsComponent/AboutContactsComponent';
import CodeComment from '../../CodeComment/CodeComment';
import './SectionComponent.css';

const SectionComponent = ({ sectionName, textContent, classPrefix }) => {
  const [sectionSelected, setSectionSelected] = useState(Object.keys(textContent)[0] || '');

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
        
        <AboutContactsComponent />
      </div>
      <div className="info-content">
        <div className="info-content-header">
          <span>{sectionName}-info</span>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className="info-content-body">
          <CodeComment text={textContent[sectionSelected]} />
        </div>
      </div>
    </div>
  );
};

export default SectionComponent;