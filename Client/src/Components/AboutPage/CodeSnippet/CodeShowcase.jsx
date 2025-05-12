import { useEffect, useState } from 'react';
import CodeCard from './CodeCard';
import './CodeShowcase.css';
import CodeComment from '../../CodeComment/CodeComment';

const CodeShowcase = () => {
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);

  const textContent = {
    "experience": "Over the past 5 years, I have worked on multiple projects involving front-end and back-end technologies. I specialize in React, JavaScript, and UI/UX design...",
    "tech-skills": "I am proficient in JavaScript, React, Node.js, and Express. I have experience with databases like MongoDB and PostgreSQL. I also have a strong understanding of RESTful APIs and web services...",
    "soft-skills": "I bring strong problem-solving skills, teamwork, and communication to every project. I am adaptable, detail-oriented, and always eager to learn and improve..."
  };
  const uri = import.meta.env.VITE_API_URL;
  const fetchUrl = `${uri}commits`;
  useEffect(() => {
    fetch(fetchUrl)
      .then(res => {
        if (!res.ok) {
          if (res.status === 429) {
            throw new Error('Too many requests. Please try again later.');
          }
          throw new Error('Failed to load commits');
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched commits:', data);
        setCommits(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error:', err.message);
        setError(err.message);
      });
  }, []);

  return (
    <div className="code-showcase-container">
      <div className='code-showcase-header'>
        <h3>// Recent commits:</h3>
      </div>
      <div className="code-showcase">
        {error ? (
          <div className="error-message" style={{ 
            color: '#ff4444', 
            textAlign: 'center',
            padding: '20px',
            fontSize: '1.2rem'
          }}>
            {error}
          </div>
        ) : commits.length > 0 ? (
          commits.map((commit, idx) => (
            <CodeCard key={idx} {...commit} />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            fontSize: '1.2rem'
          }}>
            No commits available
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeShowcase;