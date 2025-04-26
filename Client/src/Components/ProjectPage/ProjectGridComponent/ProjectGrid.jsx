import React from 'react';
import ProjectCard from '../ProjectCardComponent/ProjectCard';
import './ProjectGrid.css'; // Shared CSS file

import backgroundImageOne from '../BackgroundImages/pexels-alesiakozik-6770610.jpg';
import backgroundImageTwo from '../BackgroundImages/pexels-nate-274598-1036657.jpg';

// --- Sample Project Data ---
// In a real app, you might fetch this data from an API or import it from a local file.
const sampleProjects = [
    {
        id: 1,
        title: 'Project 1',
        shortDescription: 'Financials',
        description: 'Quickly visualize financial data with this tool.',
        // Replace with your actual image URLs or import them
        image: backgroundImageOne,
        projectUrl: 'https://github.com/purabtpatel/Financials', // Replace with actual link to project
        tags: ['React', 'CSS'] // Example tags
    },
    {
        id: 2,
        title: 'Project 2',
        shortDescription: 'Business Radar',
        description: 'Tailor made for sales and marketing teams.',
        image: backgroundImageTwo,
        projectUrl: 'https://github.com/purabtpatel/UBSBusinessTracker',
        websiteUrl: 'https://www.businessradar.biz', // Optional website URL
        tags: ['WebXR', 'Three.js']
    }
    // Add more project objects here
];
// --- End Sample Data ---


const ProjectGrid = ({ projects = sampleProjects }) => { // Use sample data as default
    // Add filtering logic here if needed based on state from a parent or sidebar component
    const filteredProjects = projects; // Placeholder for potential filtering

    return (
        <div className="projects-section">
            {/* You can add the title and filters here or in a parent component */}
            {/* <h2 className="projects-title">projects</h2> */}
            {/* <div className="projects-filters"> */}
                {/* Filter UI elements go here */}
            {/* </div> */}

            <div className="project-grid">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id} // Important for React lists
                            title={project.title}
                            shortDescription={project.shortDescription} // Assuming you have a short description
                            longDescription={project.description}
                            image={project.image}
                            projectUrl={project.projectUrl}
                            websiteUrl={project.websiteUrl} // Optional
                            tags={project.tags}
                        />
                    ))
                ) : (
                    <p>No projects found.</p> // Message if no projects match filters
                )}
            </div>
        </div>
    );
};

export default ProjectGrid;