const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

// In-memory user store (for simplicity - in production use a database)
let users = [];
const USERS_FILE = path.join(__dirname, '../users.json');

// Load users from file
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or error, use empty array
    users = [];
  }
}

// Save users to file
async function saveUsers() {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Load users on startup
loadUsers();

// Passport Local Strategy for email/password login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = users.find(u => u.email === email);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = users.find(u => u.googleId === profile.id);

    if (!user) {
      user = {
        id: users.length + 1,
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        createdAt: new Date().toISOString(),
        provider: 'google'
      };
      users.push(user);
      await saveUsers();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, provider: user.provider },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      avatar: null,
      createdAt: new Date().toISOString(),
      provider: 'local'
    };

    users.push(newUser);
    await saveUsers();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        provider: newUser.provider
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login route
router.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      res.json({
        token,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          provider: req.user.provider
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        provider: req.user.provider
      }))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
  }
);

// POST /auth/google - for client-side OAuth
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // In a real application, you'd verify the token with Google
    // For now, we'll create a user based on the token (simplified)

    // This is a simplified version - in production, verify the token with Google
    const googleUser = {
      name: 'Google User',
      email: 'user@gmail.com', // You'd get this from the verified token
      googleId: '12345' // You'd get this from the verified token
    };

    let user = users.find(u => u.googleId === googleUser.googleId);

    if (!user) {
      user = {
        id: users.length + 1,
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
        avatar: null,
        createdAt: new Date().toISOString(),
        provider: 'google'
      };
      users.push(user);
      await saveUsers();
    }

    const jwtToken = generateToken(user);

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      },
      message: 'Google login successful'
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
});

// Get current user profile
router.get('/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    createdAt: user.createdAt
  });
});

// Logout route (for completeness)
router.post('/logout', (req, res) => {
  // In JWT, logout is typically handled on the client side by removing the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
