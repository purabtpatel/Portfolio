require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const GITHUB_USERNAME = 'purabtpatel'; // replace with your GitHub username

app.get('/api/commits', async (req, res) => {
  try {
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'Portfolio-App'
      }
    });

    const events = await eventsRes.json();

    if (!Array.isArray(events)) {
      console.error("Unexpected GitHub response:", events);
      return res.status(500).json({ error: 'GitHub API returned unexpected data', details: events });
    }
    const commits = events
      .filter(event => event.type === 'PushEvent')
      .flatMap(event => event.payload.commits.map(commit => ({
        message: commit.message,
        url: commit.url,
        repo: event.repo.name,
        timestamp: event.created_at
      })))
      .slice(0, 4); // get last 4 commits

    const commitContents = await Promise.all(
      commits.map(async commit => {
        const commitRes = await fetch(commit.url, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'Portfolio-App'
          }
        });
        const commitData = await commitRes.json();

        // Filter out non-code files
        const files = (commitData.files || []).filter(file =>
          file.raw_url &&
          !file.filename.endsWith('.css') &&
          !file.filename.endsWith('.md') &&
          !file.filename.endsWith('.svg') &&
          !file.filename.endsWith('.png') &&
          !file.filename.endsWith('.jpg') &&
          !file.filename.endsWith('.json') &&
          !file.filename.endsWith('.xml') &&
          !file.filename.endsWith('.html') &&
          !file.filename.endsWith('.gif') &&
          !file.filename.endsWith('.txt') &&
          !file.filename.endsWith('.lock') &&
          !file.filename.endsWith('.yml') &&
          !file.filename.endsWith('.yaml') &&
          !file.filename.endsWith('.log') &&
          !file.filename.endsWith('.gitignore') &&
          !file.filename.endsWith('.config.js')
        );

        // Format each file with its filename and raw_url
        const fileList = files.map(file => ({
          filename: file.filename,
          raw_url: file.raw_url
        }));

        return {
          ...commit,
          files: fileList
        };
      })
    );

    res.json(commitContents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching commits');
  }
});

app.get('/api/snippet', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing raw_url query param' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'Portfolio-App'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch raw file: ${response.status}`);
    }
    const code = await response.text();
    res.set('Content-Type', 'text/plain');
    res.send(code);
  } catch (error) {
    console.error('Error fetching raw file:', error);
    res.status(500).send('// Error loading snippet');
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
