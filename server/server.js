const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const STAMPS_FILE = path.join(__dirname, 'stamps.json');

// Load admin key from environment variable or fallback
const ADMIN_KEY = process.env.ADMIN_KEY || 'my-secret-key';

app.use(cors({ origin: 'http://localhost:3000' })); // restrict to your React app origin
app.use(bodyParser.json());

// Helper: read stamps safely
const readStamps = () => {
  try {
    if (!fs.existsSync(STAMPS_FILE)) return [];
    const data = fs.readFileSync(STAMPS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading stamps:', err);
    return [];
  }
};

// Helper: write stamps safely
const writeStamps = (data) => {
  try {
    fs.writeFileSync(STAMPS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing stamps:', err);
  }
};

// Get all stamps
app.get('/api/stamps', (req, res) => {
  const stamps = readStamps();
  res.json(stamps);
});

// Add new stamp
app.post('/api/stamps', (req, res) => {
  const newStamp = req.body;

  if (!newStamp.user) {
    return res.status(400).json({ error: 'User is required' });
  }

  const stamps = readStamps();

  // Limit to 10 stamps per user
  const userStamps = stamps.filter(s => s.user === newStamp.user);
  if (userStamps.length >= 10) {
    return res.status(403).json({ error: 'Stamp limit reached' });
  }

  stamps.push(newStamp);
  writeStamps(stamps);
  res.json({ success: true });
});

// Admin clear stamps (only with secret key)
app.delete('/api/stamps', (req, res) => {
  const { adminKey } = req.body;

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  writeStamps([]);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Stamp server running at http://localhost:${PORT}`);
});
