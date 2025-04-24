import React from 'react';
import ProjectGrid from './ProjectGridComponent/ProjectGrid'; // Adjust the path as necessary
import ProjectFilter from './ProjectFilterComponent/ProjectFilter';

const ProjectPage = () => {
    return (
        <div>
        <ProjectFilter/>
        <ProjectGrid />
        </div>
    );
};

export default ProjectPage;