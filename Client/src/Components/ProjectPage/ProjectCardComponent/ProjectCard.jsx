import React from "react";
import "./ProjectCard.css";

import backgroundImageOne from '../BackgroundImages/pexels-alesiakozik-6770610.jpg';

const tagColors = {
  React: "#61dafb",
  JavaScript: "#f7df1e",
  Nginx: "#009639",
  Python: "#3776ab",
  NodeJS: "#3c873a",
  HTML: "#e34f26",
  CSS: "#264de4",
  // Add more as needed
};

const ProjectCard = ({ title, shortDescription, longDescription, image, projectUrl, websiteUrl, tags = [] }) => {
  return (
    <div className="project-card-container">
      <div className="project-card-header">
        <h3>{title}</h3>
        <span className="divider">//</span> {shortDescription}
      </div>

      <div className="project-card">
        <div
          className="project-card-image"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="tag-icons">
            {tags.map((tag) => (
              <div
                key={tag}
                className="tag-icon"
                style={{ backgroundColor: tagColors[tag] || "#ccc" }}
                title={tag}
              >
                <img
                  src={`/logos/${tag.toLowerCase()}.svg`}
                  alt={tag}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="project-card-content">
          <p className="description">{longDescription}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
          {websiteUrl && (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="project-link">
            View website
          </a>

          )}
          
          <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="project-link">
            View Project on GitHub
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
