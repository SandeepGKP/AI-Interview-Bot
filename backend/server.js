// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const config = require('./config');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = config.port;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://ai-interview-bot-hfa6.onrender.com'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport.js
app.use(passport.initialize());

// API Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
