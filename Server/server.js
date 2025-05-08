require('dotenv').config();
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 1200 });
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_USERNAME = 'purabtpatel';
const WHITELISTED_IP = process.env.WHITELISTED_IP;
const HIGHSCORES_FILE = path.join(__dirname, 'highscores.json');

const validateEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateName = name =>
  /^[a-zA-Z\s.'-]{2,50}$/.test(name.trim());

const containsLink = str =>
  /https?:\/\/|www\./i.test(str);


async function initializeHighscores() {
  try {
    await fs.access(HIGHSCORES_FILE);
  } catch {
    await fs.writeFile(HIGHSCORES_FILE, JSON.stringify([]));
  }
}

initializeHighscores();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skip: (req, res) => {
    return req.ip === WHITELISTED_IP;
  },
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many messages sent. Please try again later.' });
  },
});

app.get('/api/highscores', async (req, res) => {
  try {
    const data = await fs.readFile(HIGHSCORES_FILE);
    const highscores = JSON.parse(data);
    res.json(highscores.sort((a, b) => b.score - a.score).slice(0, 5));
  } catch (error) {
    console.error('Error reading highscores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/highscores', async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number' || score <= 0 || score > 1600) {
      return res.status(400).json({ error: 'Valid name and positive score are required' });
    }

    const data = await fs.readFile(HIGHSCORES_FILE);
    let highscores = JSON.parse(data);

    highscores.push({ name, score, date: new Date().toISOString() });
    highscores = highscores.sort((a, b) => b.score - a.score).slice(0, 5);

    await fs.writeFile(HIGHSCORES_FILE, JSON.stringify(highscores, null, 2));
    res.json(highscores);
  } catch (error) {
    console.error('Error saving highscore:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/commits', async (req, res) => {
  const cacheKey = 'latestCommits';
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

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
      .slice(0, 6);

    const commitContents = await Promise.all(
      commits.map(async commit => {
        const commitRes = await fetch(commit.url, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'Portfolio-App'
          }
        });
        const commitData = await commitRes.json();

        const files = (commitData.files || []).filter(file =>
          file.raw_url &&
          !file.filename.match(/\.(css|md|svg|png|jpg|jpeg|json|xml|html|gif|txt|lock|yml|yaml|log|gitignore|config\.js)$/)
        );

        return {
          ...commit,
          files: files.map(file => ({
            filename: file.filename,
            raw_url: file.raw_url
          }))
        };
      })
    );

    cache.set(cacheKey, commitContents);
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

  const allowedPrefix = 'https://raw.githubusercontent.com/purabtpatel/';

  if (!url.startsWith(allowedPrefix)) {
    console.warn(`Blocked snippet request for invalid URL: ${url}`);
    return res.status(403).json({ error: 'Access to this URL is not allowed' });
  }

  const cacheKey = `snippet:${url}`;
  const cachedSnippet = cache.get(cacheKey);

  if (cachedSnippet) {
    res.set('Content-Type', 'text/plain');
    return res.send(cachedSnippet);
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
    cache.set(cacheKey, code);
    res.set('Content-Type', 'text/plain');
    res.send(code);
  } catch (error) {
    console.error('Error fetching raw file:', error);
    res.status(500).send('// Error loading snippet');
  }
});

app.post('/api/contact', contactLimiter, express.json(), async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!validateName(trimmedName)) {
    return res.status(400).json({ message: 'Invalid name format' });
  }

  if (!validateEmail(trimmedEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
    return res.status(400).json({ message: 'Message must be between 10 and 1000 characters' });
  }

  if (containsLink(trimmedMessage)) {
    return res.status(400).json({ message: 'Links are not allowed in the message' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${trimmedName}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `New message from ${trimmedName}`,
      replyTo: trimmedEmail,
      text: trimmedMessage,
      html: `<p><strong>From:</strong> ${trimmedName} (${trimmedEmail})</p><p><strong>Message:</strong><br>${trimmedMessage}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});