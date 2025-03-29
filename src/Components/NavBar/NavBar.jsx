import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css'; // Optional: Add custom styles

const NavBar = () => {
    const location = useLocation();
    const [activePage, setActivePage] = useState("");

    useEffect(() => {
        switch (location.pathname) {
            case "/about":
                setActivePage("about_me");
                break;
            case "/projects":
                setActivePage("projects");
                break;
            case "/contact":
                setActivePage("contact_me");
                break;
            default:
                setActivePage("home");
        }
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li>
                    <Link draggable="false" to="/">purab_patel</Link>
                </li>
                <li className={activePage === "home" ? "active" : ""}>
                    <Link draggable="false" to="/">\hello</Link>
                </li>
                <li className={activePage === "about_me" ? "active" : ""}>
                    <Link draggable="false" to="/about">\about_me</Link>
                </li>
                <li className={activePage === "projects" ? "active" : ""}>
                    <Link draggable="false" to="/projects">\projects</Link>
                </li>
                <li className={activePage === "contact_me" ? "active" : ""}>
                    <Link draggable="false" to="/contact">\contact_me</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
