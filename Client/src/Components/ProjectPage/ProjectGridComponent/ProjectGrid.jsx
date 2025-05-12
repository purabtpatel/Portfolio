import React from 'react';
import ProjectCard from '../ProjectCardComponent/ProjectCard';
import './ProjectGrid.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ProjectGrid = ({ projects = sampleProjects }) => {
    const filteredProjects = projects;

    return (
        <div className="projects-section">
            <div className="projects-header">
                <div className="projects-header-text">
                    <span>all;</span>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>

            <div className="project-grid">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            shortDescription={project.shortDescription}
                            longDescription={project.description}
                            image={project.image}
                            projectUrl={project.projectUrl}
                            websiteUrl={project.websiteUrl}
                            tags={project.tags}
                        />
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
    );
};

export default ProjectGrid;