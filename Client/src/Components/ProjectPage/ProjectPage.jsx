import React, { useState } from 'react';
import ProjectGrid from './ProjectGridComponent/ProjectGrid';
import ProjectFilter from './ProjectFilterComponent/ProjectFilter';

import backgroundImageOne from './BackgroundImages/pexels-alesiakozik-6770610.jpg';
import backgroundImageTwo from './BackgroundImages/pexels-nate-274598-1036657.jpg';
import './ProjectPage.css'; // Shared CSS file

const allProjects = [
    {
        id: 1,
        title: 'Project 1',
        shortDescription: 'Financials',
        description: 'Quickly visualize financial data with this tool.',
        image: backgroundImageOne,
        projectUrl: 'https://github.com/purabtpatel/Financials',
        tags: ['React', 'CSS', 'Python']
    },
    {
        id: 2,
        title: 'Project 2',
        shortDescription: 'Business Radar',
        description: 'Tailor made for sales and marketing teams.',
        image: backgroundImageTwo,
        projectUrl: 'https://github.com/purabtpatel/UBSBusinessTracker',
        websiteUrl: 'https://www.businessradar.biz',
        tags: ['React', 'CSS']
    },
    {
        id: 3,
        title: 'Project 2',
        shortDescription: 'Business Radar',
        description: 'Tailor made for sales and marketing teams.',
        image: backgroundImageTwo,
        projectUrl: 'https://github.com/purabtpatel/UBSBusinessTracker',
        websiteUrl: 'https://www.businessradar.biz',
        tags: ['React', 'CSS']
    },
    {
        id: 4,
        title: 'Project 2',
        shortDescription: 'Business Radar',
        description: 'Tailor made for sales and marketing teams.',
        image: backgroundImageTwo,
        projectUrl: 'https://github.com/purabtpatel/UBSBusinessTracker',
        websiteUrl: 'https://www.businessradar.biz',
        tags: ['React', 'CSS']
    },
    {
        id: 5,
        title: 'Project 2',
        shortDescription: 'Business Radar',
        description: 'Tailor made for sales and marketing teams.',
        image: backgroundImageTwo,
        projectUrl: 'https://github.com/purabtpatel/UBSBusinessTracker',
        websiteUrl: 'https://www.businessradar.biz',
        tags: ['React', 'CSS']
    }
];

const ProjectPage = () => {
    const [selectedTags, setSelectedTags] = useState([]);

    const filteredProjects = selectedTags.length === 0
        ? allProjects
        : allProjects.filter(project =>
            selectedTags.every(tag => project.tags.includes(tag))
        );

    return (
        <div className="project-page">
            <ProjectFilter selectedTags={selectedTags} onTagChange={setSelectedTags} />
            <ProjectGrid projects={filteredProjects} />
        </div>
    );
};

export default ProjectPage;