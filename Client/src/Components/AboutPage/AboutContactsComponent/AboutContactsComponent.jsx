import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AboutContactsComponent.css';

const AboutContactsComponent = ({ header, list }) => {
  const [isContactsOpen, setIsContactsOpen] = useState(true);

  return (
    <div className="contacts-dropdown">
      <button
        className="dropdown-button"
        onClick={() => setIsContactsOpen(!isContactsOpen)}
      >
        <div className="icon-container" >
          <FontAwesomeIcon icon={isContactsOpen ? faChevronDown : faChevronRight} />
        </div>
        {header}
      </button>
      {isContactsOpen && (
        <div className="dropdown-content">
          {list.map((item, index) => (
            <p key={index} className="contact-item">
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutContactsComponent;