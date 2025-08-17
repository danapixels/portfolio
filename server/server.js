const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const STAMPS_FILE = path.join(__dirname, 'stamps.json');

// load admin key and JWT secret from environment variables
const ADMIN_KEY = process.env.ADMIN_KEY || 'my-secret-key';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const PASSWORD_HASH = process.env.PASSWORD_HASH || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"

// allow all origins during development
app.use((req, res, next) => {
  // Allow both Vite dev server ports and Docker port
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // important for cookies
  
  // handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

// middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // verify password
    const isValidPassword = await bcrypt.compare(password, PASSWORD_HASH);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // generate JWT token
    const token = jwt.sign(
      { 
        authenticated: true, 
        timestamp: Date.now() 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax', // changed from 'strict' to allow cross-origin in development
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      user: { authenticated: true }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// verify authentication status
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: req.user 
  });
});

// read stamps
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

// write stamps
const writeStamps = (data) => {
  try {
    fs.writeFileSync(STAMPS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing stamps:', err);
  }
};

// get all stamps
app.get('/api/stamps', authenticateToken, (req, res) => {
  const stamps = readStamps();
  res.json(stamps);
});

// add new stamp
app.post('/api/stamps', authenticateToken, (req, res) => {
  const newStamp = req.body;
  const stamps = readStamps();

  if (!newStamp.user) {
    return res.status(400).json({ error: 'User is required' });
  }

  // coordinate format for stamp position
  if (typeof newStamp.x !== 'string' || !newStamp.x.endsWith('%') ||
      typeof newStamp.y !== 'string' || !newStamp.y.endsWith('%')) {
    return res.status(400).json({ error: 'Coordinates must be percentage values (e.g. "50%")' });
  }

  // check if adding this stamp would exceed the global limit
  if (stamps.length >= 1000) {
    // clear all stamps when limit is reached
    writeStamps([]);
    return res.json({ success: true, message: 'Stamp limit reached, all stamps cleared' });
  }

  // limit to 100 stamps per user
  const userStamps = stamps.filter(s => s.user === newStamp.user);
  if (userStamps.length >= 100) {
    return res.status(403).json({ error: 'Stamp limit reached' });
  }

  // percentage values for stamp position
  const stampToSave = {
    ...newStamp,
    x: newStamp.x,
    y: newStamp.y
  };

  stamps.push(stampToSave);
  writeStamps(stamps);
  res.json({ success: true });
});

// admin clear stamps (only with secret key)
app.delete('/api/stamps', (req, res) => {
  const { adminKey } = req.body;

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  writeStamps([]);
  res.json({ success: true });
});

// delete stamps for a specific user
app.post('/api/stamps/clear', authenticateToken, (req, res) => {
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
