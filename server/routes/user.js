import express from 'express';
import sql from '../db.js';

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await sql`
      SELECT id, name, email, age, gender, weight, height, conditions, created_at
      FROM users WHERE id = ${id}
    `;
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
