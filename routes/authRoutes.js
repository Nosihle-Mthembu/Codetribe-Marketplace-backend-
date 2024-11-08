const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();


let users = [];

// Register route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ message: 'User created successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

module.exports = router;
