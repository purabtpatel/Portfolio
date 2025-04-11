const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const GITHUB_USERNAME = 'purabtpatel'; // replace with your GitHub username

app.get('/api/commits', async (req, res) => {
  try {
    const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
    const events = await eventsRes.json();

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
          const commitRes = await fetch(commit.url);
          const commitData = await commitRes.json();
      
          const file = commitData.files?.find(f =>
            f.raw_url &&
            !f.filename.endsWith('.css') &&
            !f.filename.endsWith('.md') &&
            !f.filename.endsWith('.svg') &&
            !f.filename.endsWith('.png') &&
            !f.filename.endsWith('.jpg') &&
            !f.filename.endsWith('.json')
          );
      
          if (file && file.raw_url) {
            const rawRes = await fetch(file.raw_url);
            const rawCode = await rawRes.text();
      
            return {
              ...commit,
              filename: file.filename,
              codeSnippet: rawCode
            };
          }
          return null;
        })
      );

    res.json(commitContents.filter(Boolean));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching commits');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
