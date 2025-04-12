import React, { useState, useEffect } from 'react';
import './CodeCard.css';
import CodeSnippet from './CodeSnippet'; // Assuming you have a CodeSnippet component

const CodeCard = ({ message, url, repo, timestamp, files }) => {
  const username = "purabtpatel";
  const avatarUrl = "https://avatars.githubusercontent.com/u/95395767?";
  const createdAt = new Date(timestamp);
const now = new Date();
const diffInSeconds = Math.floor((now - createdAt) / 1000);

let timeAgo;
if (diffInSeconds < 60) {
  timeAgo = `Created just now`;
} else if (diffInSeconds < 3600) {
  const minutes = Math.floor(diffInSeconds / 60);
  timeAgo = `Created ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
} else if (diffInSeconds < 86400) {
  const hours = Math.floor(diffInSeconds / 3600);
  timeAgo = `Created ${hours} hour${hours !== 1 ? 's' : ''} ago`;
} else if (diffInSeconds < 2592000) {
  const days = Math.floor(diffInSeconds / 86400);
  timeAgo = `Created ${days} day${days !== 1 ? 's' : ''} ago`;
} else {
  const months = Math.floor(diffInSeconds / 2592000);
  timeAgo = `Created ${months} month${months !== 1 ? 's' : ''} ago`;
}

  const [selectedFile, setSelectedFile] = useState();


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

      {/* Body: Two columns */}
      <div className="code-card-body">
        {/* File list on the left */}
        <div className="code-card-files">
          {files.slice(0, 5).map(file => (
            <button
              key={file.filename}
              className={`file-button ${file.filename === selectedFile?.filename ? 'active' : ''}`}
              onClick={() => setSelectedFile(file)}
            >
              {shortenFilename(file.filename.split('/').pop(), 14)}
            </button>
          ))}



          {files.length > 5 && (
            <a
              href={`https://github.com/${repo}/commit/${url.split('/').pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="file-button show-more-button"
            >
              +{files.length - 5} more
            </a>

          )}
        </div>


        {/* Code Snippet viewer on the right */}
        <div className="code-card-viewer">
          {selectedFile ? (
            <CodeSnippet key={selectedFile.raw_url} raw_url={selectedFile.raw_url} />
          ) : (
            <div className="code-card-placeholder">Select a file to view the code snippet</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="code-card-footer">
        <a href={`https://github.com/${repo}/commit/${url.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="code-card-link">💬 details</a>
      </div>
    </div>
  );
};
const shortenFilename = (filename, maxLength) => {
  if (filename.length <= maxLength) return filename;

  const start = filename.slice(0, maxLength / 2 - 3);
  const end = filename.slice(-maxLength / 2 );
  return `${start}...${end}`;
};

export default CodeCard;
