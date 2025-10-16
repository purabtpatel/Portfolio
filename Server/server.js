import 'dotenv/config';
import NodeCache from 'node-cache';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Filter } from 'bad-words';
import { timeStamp } from 'console';
import { createClient } from 'redis';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redisClient = createClient();
await redisClient.connect();


const cache = new NodeCache({ stdTTL: 300 });
const app = express();

app.use(cors());
app.use(express.json());

const GITHUB_USERNAME = 'purabtpatel';
const HIGHSCORES_FILE = process.env.HIGHSCORES_FILE_PATH || path.join(__dirname, 'highscores.json');
const LOG_FILE = "/home/ubuntu/logs/traffic.log";

const profanityFilter = new Filter();
profanityFilter.addWords('wanker', 'twat');

const validateEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateName = name =>
  /^[a-zA-Z\s.'-]{2,50}$/.test(name.trim());

const containsLink = str =>
  /https?:\/\/|www\./i.test(str);

const containsProfanity = (str) => {
  try {
    return profanityFilter.isProfane(str);
  } catch (error) {
    console.error('Profanity filter error:', error);
    return false;
  }
};



const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many messages sent. Please try again later.' });
  },
});

const commitsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests to fetch commits. Please try again later.' });
  },
});

const snippetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests to fetch snippets. Please try again later.' });
  },
});

app.use('/api/profile-photos', express.static(path.join(__dirname, 'uploads')));


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

async function initializeHighscores() {
  try {
    const data = await fs.readFile(HIGHSCORES_FILE, 'utf8');
    if (!data.trim()) {
      console.log('Highscores file is empty, initializing with []');
      await fs.writeFile(HIGHSCORES_FILE, JSON.stringify([], null, 2));
      return;
    }
    JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Highscores file not found, creating new file');
      await fs.writeFile(HIGHSCORES_FILE, JSON.stringify([], null, 2));
    } else {
      console.error('Error initializing highscores file:', error);
      throw error;
    }
  }
}

await initializeHighscores();

app.get('/api/highscores', async (req, res) => {
  try {
    const data = await fs.readFile(HIGHSCORES_FILE, 'utf8');
    if (!data.trim()) {
      console.warn('Highscores file is empty');
      return res.json([]);
    }
    const highscores = JSON.parse(data);
    if (!Array.isArray(highscores)) {
      console.error('Highscores is not an array:', highscores);
      return res.status(500).json({ error: 'Corrupted highscores data' });
    }
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

    const trimmedName = name.trim();
    if (!validateName(trimmedName)) {
      return res.status(400).json({ error: 'Invalid name format' });
    }

    if (containsProfanity(trimmedName)) {
      return res.status(400).json({ error: 'Inappropriate name detected. Please choose a different name.' });
    }

    // Read and validate file contents
    let highscores = [];
    try {
      const data = await fs.readFile(HIGHSCORES_FILE, 'utf8');
      if (data.trim()) {
        highscores = JSON.parse(data);
        if (!Array.isArray(highscores)) {
          console.error('Highscores is not an array:', highscores);
          highscores = [];
        }
      }
    } catch (error) {
      console.warn('Error reading highscores, resetting to empty array:', error);
      highscores = [];
    }

    // Add new score
    highscores.push({ name: trimmedName, score, date: new Date().toISOString() });
    highscores = highscores.sort((a, b) => b.score - a.score).slice(0, 5);

    // Write back to file
    await fs.writeFile(HIGHSCORES_FILE, JSON.stringify(highscores, null, 2));
    res.json(highscores);
  } catch (error) {
    console.error('Error saving highscore:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/commits', async (req, res) => {
  try {


    const commitsRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/Portfolio/commits?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GHUB_TOKEN}`,
          'User-Agent': 'Portfolio-App'
        }
      }
    );

    const commits = await commitsRes.json();

    if (!Array.isArray(commits)) {
      console.error("Unexpected GitHub response:", commits);
      return res.status(500).json({ error: 'GitHub API returned unexpected data', details: commits });
    }


    const commitContents = await Promise.all(
      commits.map(async commit => {
        const commitRes = await fetch(commit.url, {
          headers: {
            Authorization: `Bearer ${process.env.GHUB_TOKEN}`,
            'User-Agent': 'Portfolio-App'
          }
        });
        const commitData = await commitRes.json();

        const files = (commitData.files || []).filter(file =>
          file.raw_url &&
          !file.filename.match(/\.(css|md|svg|png|jpg|jpeg|json|xml|html|gif|txt|lock|yml|yaml|log|gitignore|config\.js)$/)
        );



        if (files.length > 0) {
          return {
            ...commit,
            message: commitData.commit.message,
            url: commitData.html_url,
            repo: commitData.html_url.split('/')[4],
            timeStamp: commitData.commit.author.date,
            files: files.map(file => ({
              filename: file.filename,
              raw_url: file.raw_url
            }))
          };
        }
        return null;
      })
    );

    const validCommits = commitContents
      .filter(commit => commit !== null)
      .slice(0, 10);

    console.log('Valid commits:', validCommits);

    if (validCommits.length === 0) {
      return res.status(404).json({ message: 'No commits found with matching files' });
    }


    res.json(validCommits);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching commits');
  }
});

app.get('/api/snippet', snippetLimiter, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing raw_url query param' });
  }

  const allowedPrefix = 'https://github.com/purabtpatel';

  if (!url.startsWith(allowedPrefix)) {
    console.warn(`Blocked snippet request for invalid URL: ${url}`);
    return res.status(403).json({ error: 'Access to this URL is not allowed' });
  }

  const cacheKey = `snippet_${url}`;
  const cachedSnippet = cache.get(cacheKey);

  if (cachedSnippet) {
    console.log('Serving from cache');
    res.set('Content-Type', 'text/plain');
    return res.send(cachedSnippet);
  }
  console.log('Fetching from GitHub API:', url);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GHUB_TOKEN}`,
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

app.get('/api/non-redis-data', async (req, res) => {
  try{
   const commitsRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/Portfolio/commits?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GHUB_TOKEN}`,
          'User-Agent': 'Portfolio-App'
        }
      }
    );

    const commits = await commitsRes.json();
    res.json(commits);
  }catch (error) {
    console.error(error);
    res.status(500).send('Error fetching commits');
  }
});


// Your Express route
app.get('/api/redis-data', async (req, res) => {
  const cacheKey = 'github:portfolio:commits';

  try {
    // Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If not cached, fetch from GitHub
    const commitsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/Portfolio/commits?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GHUB_TOKEN}`,
          'User-Agent': 'Portfolio-App'
        }
      }
    );

    const commits = await commitsRes.json();

    // Cache the result for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(commits));

    res.json(commits);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching commits');
  }
});


app.post("/api/track", express.json(), async (req, res) => {
  try {
    const { page, referrer, userAgent } = req.body;

    const log = {
      time: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      page: page || "unknown",
      referrer: referrer || "",
      ua: userAgent || req.headers["user-agent"],
    };

    await fs.promises.appendFile(LOG_FILE, JSON.stringify(log) + "\n");
    res.sendStatus(204);
  } catch (err) {
    console.error("Tracker error:", err);
    res.sendStatus(500);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));