import { useEffect, useState } from 'react';
import CodeCard from './CodeCard';
import './CodeShowcase.css';
import CodeComment from '../../CodeComment/CodeComment';

const CodeShowcase = () => {
  const [commits, setCommits] = useState([]);

  const textContent = {
    "experience": "Over the past 5 years, I have worked on multiple projects involving front-end and back-end technologies. I specialize in React, JavaScript, and UI/UX design...",
    "tech-skills": "I am proficient in JavaScript, React, Node.js, and Express. I have experience with databases like MongoDB and PostgreSQL. I also have a strong understanding of RESTful APIs and web services...",
    "soft-skills": "I bring strong problem-solving skills, teamwork, and communication to every project. I am adaptable, detail-oriented, and always eager to learn and improve..."
};

  useEffect(() => {
    fetch('http://localhost:5000/api/commits')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched commits:', data);
        setCommits(data);
      })
      .catch(err => console.error('Failed to load commits', err));
  }, []);

  return (
    <div className="code-showcase-container">
      <div className='code-showcase-header'>
        <h3>// Recent commits:</h3>
      </div>
      <div className="code-showcase">
        {commits.map((commit, idx) => (
          <CodeCard key={idx} {...commit} />
        ))}
      </div>
    </div>
  );
};

export default CodeShowcase;
