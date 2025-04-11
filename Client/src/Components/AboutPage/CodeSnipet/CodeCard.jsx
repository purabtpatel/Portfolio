import React from 'react';
import './CodeCard.css';

const CodeCard = ({ filename, message, repo, timestamp, url, codeSnippet }) => {
  const username = "purabtpatel";
  const avatarUrl = "https://avatars.githubusercontent.com/u/95395767?";
  const createdAt = new Date(timestamp);
  const diffInMs = Date.now() - createdAt;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  const timeAgo =
    diffInDays < 30
      ? `Created ${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
      : `Created ${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) !== 1 ? 's' : ''} ago`;

  // Placeholder snippet until real code is loaded
  

  return (
    <div className="code-card">
      {/* Header */}
      <div className="code-card-header">
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
          <img src={avatarUrl} alt={`${username}'s avatar`} className="code-card-avatar" />
        </a>
        <div className="code-card-userinfo">
          <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="code-card-username">
            @{username}
          </a>
            <span className="code-card-timestamp">{timeAgo}</span>
        </div>
      </div>

      {/* Info */}
      <div className="code-card-meta">
        <span className="code-card-file">{filename}</span>
        <span className="code-card-repo">{repo}</span>
      </div>

      {/* Code */}
      <div className="code-card-snippet">
        <pre>
          <code>{codeSnippet}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="code-card-footer">
        <a href={url} target="_blank" rel="noopener noreferrer" className="code-card-link">💬 details</a>
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="code-card-link">⭐ stars</a>
      </div>
    </div>
  );
};

export default CodeCard;
