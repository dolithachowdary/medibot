import express from 'express';
import bcrypt from 'bcrypt';
import sql from '../db.js';

const router = express.Router();
const SALT_ROUNDS = 10;

// Sign Up
router.post('/signup', async (req, res) => {
    const { name, email, password, age, gender, weight, height, conditions } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    try {
        // Check if user already exists
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existing.length > 0) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const conditionsArray = conditions
            ? conditions.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const [user] = await sql`
      INSERT INTO users (name, email, password_hash, age, gender, weight, height, conditions)
      VALUES (${name}, ${email}, ${password_hash}, ${age || null}, ${gender || null},
              ${weight || null}, ${height || null}, ${conditionsArray})
      RETURNING id, name, email, age, gender, weight, height, conditions, created_at
    `;

        res.status(201).json({ user });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [user] = await sql`
      SELECT id, name, email, password_hash, age, gender, weight, height, conditions, created_at
      FROM users WHERE email = ${email}
    `;

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const { password_hash, ...safeUser } = user;
        res.json({ user: safeUser });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Server error during sign in.' });
    }
});

export default router;
