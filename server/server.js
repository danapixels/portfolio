const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const STAMPS_FILE = path.join(__dirname, 'stamps.json');

// Load admin key from environment variable or fallback
const ADMIN_KEY = process.env.ADMIN_KEY || 'my-secret-key';

// Allow all origins during development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
  const stamps = readStamps();

  if (!newStamp.user) {
    return res.status(400).json({ error: 'User is required' });
  }

  // Validate coordinate format
  if (typeof newStamp.x !== 'string' || !newStamp.x.endsWith('%') ||
      typeof newStamp.y !== 'string' || !newStamp.y.endsWith('%')) {
    return res.status(400).json({ error: 'Coordinates must be percentage values (e.g. "50%")' });
  }

  // Check if adding this stamp would exceed the global limit
  if (stamps.length >= 300) {
    // Clear all stamps when limit is reached
    writeStamps([]);
    return res.json({ success: true, message: 'Stamp limit reached, all stamps cleared' });
  }

  // Limit to 100 stamps per user
  const userStamps = stamps.filter(s => s.user === newStamp.user);
  if (userStamps.length >= 100) {
    return res.status(403).json({ error: 'Stamp limit reached' });
  }

  // Ensure we store the percentage values
  const stampToSave = {
    ...newStamp,
    x: newStamp.x,
    y: newStamp.y
  };

  stamps.push(stampToSave);
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

// Delete stamps for a specific user
app.post('/api/stamps/clear', (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Clear stamps request received for user:', userId);
    
    if (!userId) {
      console.log('No userId provided in request body');
      return res.status(400).json({ error: 'User ID is required' });
    }

    const stamps = readStamps();
    console.log('Current stamps:', stamps);
    const updatedStamps = stamps.filter(stamp => stamp.user !== userId);
    console.log('Updated stamps:', updatedStamps);
    
    try {
      writeStamps(updatedStamps);
      return res.status(200).json({ 
        success: true,
        message: 'Stamps cleared successfully',
        stampsRemoved: stamps.length - updatedStamps.length
      });
    } catch (writeError) {
      console.error('Error writing stamps:', writeError);
      return res.status(500).json({ 
        error: 'Failed to save updated stamps',
        details: writeError.message 
      });
    }
  } catch (error) {
    console.error('Error in clear stamps endpoint:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Stamp server running at http://localhost:${PORT}`);
});
