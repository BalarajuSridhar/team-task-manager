const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Login
router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Get current user
router.get('/me', auth(), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all users (Admin only)
router.get('/users', auth(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;