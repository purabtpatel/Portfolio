import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AboutContactsComponent.css'; // Assuming you have a CSS file for styling

const AboutContactsComponent = () => {
    {
        const [isContactsOpen, setIsContactsOpen] = useState(true);
      
        return (
          <div className="contacts-dropdown">
            <button className="dropdown-button" onClick={() => setIsContactsOpen(!isContactsOpen)}>
            <div className="icon-container">
              <FontAwesomeIcon icon={isContactsOpen ? faChevronDown : faChevronRight} />
            </div>
            contacts
            </button>
            {isContactsOpen && (
              <div className="dropdown-content">
                <p>Email: purabtpatel@gmail.com</p>
                <p>Phone: (732)692-3419</p>
              </div>
            )}
          </div>
        );
    }
};
export default AboutContactsComponent;