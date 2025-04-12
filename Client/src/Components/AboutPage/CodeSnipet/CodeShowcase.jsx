import { useEffect, useState } from 'react';
import CodeCard from './CodeCard';
import './CodeShowcase.css'; // Assuming you have a CSS file for styling

const CodeShowcase = () => {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/commits')
      .then(res => res.json())
      .then(data => {
      console.log('Fetched commits:', data); // 👈 This will show what the server returns
      setCommits(data);
    })
      .catch(err => console.error('Failed to load commits', err));
  }, []);

  return (
    <>
      <h2>// Code snippet showcase:</h2>
      <div className="code-showcase">
        <div className="grid">
          {commits.map((commit, idx) => (
            <CodeCard key={idx} {...commit} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CodeShowcase;
