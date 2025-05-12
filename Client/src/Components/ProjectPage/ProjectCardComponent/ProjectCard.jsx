import React from "react";
import "./ProjectCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faJsSquare,
  faPython,
  faNodeJs,
  faHtml5,
  faCss3Alt,
  faNpm,
  faGitAlt,
} from "@fortawesome/free-brands-svg-icons";


const tagColors = {
  React: "var(--teal-300)",
  JavaScript: "var(--accent-orange)",
  Nginx: "var(--success-700)",
  Python: "var(--info-400)",
  NodeJS: "var(--success-500)",
  HTML: "var(--orange-400)",
  CSS: "var(--accent-blue)",
  TypeScript: "var(--indigo-500)",
  Git: "var(--orange-600)",
  Docker: "var(--teal-800)",
};

const tagIcons = {
  React: faReact,
  JavaScript: faJsSquare,
  Python: faPython,
  NodeJS: faNodeJs,
  HTML: faHtml5,
  CSS: faCss3Alt,
  NPM: faNpm,
  Git: faGitAlt,
};

const ProjectCard = ({
  title,
  shortDescription,
  longDescription,
  image,
  projectUrl,
  websiteUrl,
  tags = [],
}) => {
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
                style={{ backgroundColor: tagColors[tag] || "var(--gray-600)" }}
                title={tag}
              >
                {tagIcons[tag] ? (
                  <FontAwesomeIcon icon={tagIcons[tag]} color="black" size="lg" />
                ) : (
                  <span style={{ fontSize: "0.75rem", color: "#000" }}>
                    {tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="project-card-content">
          <p className="description">{longDescription}</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                View website
              </a>
            )}
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Project on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
