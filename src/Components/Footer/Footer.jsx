import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css"; // Custom styles

const Footer = () => {
    return (
        <footer className="footer">
            <span>find me in:</span>
            <ul className="footer-links">
                
                <li>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                </li>

                <li>
                    <a href="https://github.com/purabtpatel" target="_blank" rel="noopener noreferrer">
                        @purabtpatel <FontAwesomeIcon icon={faGithub} /> 
                    </a>
                </li>
               
            </ul>
        </footer>
    );
};

export default Footer;
