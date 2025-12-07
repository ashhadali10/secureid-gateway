const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
app.use(helmet()); // Security headers
app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock user DB
const users = [
  { id: 'user123', email: 'alice@example.com', password: 'hashed' }
];

// 🔥 Intentional vulnerability: IDOR in /profile
app.get('/profile/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    // ❌ No ownership check → IDOR
    res.json({ email: user.email });
  } else {
    res.status(404).send('Not found');
  }
});

// Mock login (no real auth, just to trigger JWT logic)
app.post('/login', (req, res) => {
  // ⚠️ Fake secret! (Will be caught by gitleaks)
  const token = jwt.sign({ id: 'user123' }, 'super-secret-jwt-key-2025');
  res.json({ token });
});

app.listen(3000, () => {
  console.log('SecureID Gateway running on http://localhost:3000');
});
