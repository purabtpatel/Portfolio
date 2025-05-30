import React, { useState } from 'react';
import {
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Box
} from '@mui/material';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import './ProjectFilter.css';

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
const techOptions = Object.keys(tagIcons);

const ProjectFilter = ({ selectedTags = [], onTagChange }) => {
    const [activeTags, setActiveTags] = useState(selectedTags);

    const handleChange = (event) => {
        const tag = event.target.name;
        const newTags = event.target.checked
            ? [...activeTags, tag]
            : activeTags.filter(t => t !== tag);

        setActiveTags(newTags);
        onTagChange(newTags);
    };

    return (
        <div className="project-filter-column">
            <div className="project-filter-header" >
                <FontAwesomeIcon icon={faChevronDown} />
                projects
            </div>
            <div className='project-filters'>
                <FormGroup column>
                    {techOptions.map((tag) => (
                        <FormControlLabel
                            key={tag}
                            control={
                                <Checkbox
                                    checked={activeTags.includes(tag)}
                                    onChange={handleChange}
                                    name={tag}
                                    sx={{
                                        color: 'var(--bright-lines)',
                                        '&.Mui-checked': {
                                            color: 'var(--button-background)',
                                        },
                                    }}
                                />
                            }
                            label={tag}
                            sx={{ color: 'var(--bright-lines)' }}
                        />
                    ))}
                </FormGroup>

            </div>
        </div>
    );
};

export default ProjectFilter;
