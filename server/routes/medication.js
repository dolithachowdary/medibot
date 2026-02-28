import express from 'express';
import sql from '../db.js';

const router = express.Router();

// Get medications and logs for a user and date
router.get('/', async (req, res) => {
    const { user_id, date } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    try {
        // Fetch active medications
        const medications = await sql`
            SELECT * FROM medications 
            WHERE user_id = ${user_id} AND is_active = TRUE
        `;

        // Fetch logs for the specific date
        const logs = await sql`
            SELECT medication_id, dose_type FROM medication_logs
            WHERE user_id = ${user_id} AND log_date = ${date || new Date().toISOString().split('T')[0]}
        `;

        res.json({ medications, logs });
    } catch (err) {
        console.error('Fetch medications error:', err);
        res.status(500).json({ error: 'Failed to fetch medications' });
    }
});

// Add new medication
router.post('/', async (req, res) => {
    const { user_id, name, dosage, frequency, start_date, duration_days } = req.body;
    if (!user_id || !name) return res.status(400).json({ error: 'Missing required fields' });

    try {
        const [medication] = await sql`
            INSERT INTO medications (user_id, name, dosage, frequency, start_date, duration_days)
            VALUES (${user_id}, ${name}, ${dosage}, ${frequency}, ${start_date}, ${duration_days})
            RETURNING *
        `;
        res.json({ ok: true, medication });
    } catch (err) {
        console.error('Add medication error:', err);
        res.status(500).json({ error: 'Failed to add medication' });
    }
});

// Toggle medication log
router.post('/log', async (req, res) => {
    const { user_id, medication_id, log_date, dose_type, taken } = req.body;
    if (!user_id || !medication_id || !log_date || !dose_type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (taken) {
            await sql`
                INSERT INTO medication_logs (user_id, medication_id, log_date, dose_type)
                VALUES (${user_id}, ${medication_id}, ${log_date}, ${dose_type})
                ON CONFLICT DO NOTHING
            `;
        } else {
            await sql`
                DELETE FROM medication_logs
                WHERE user_id = ${user_id} AND medication_id = ${medication_id} 
                AND log_date = ${log_date} AND dose_type = ${dose_type}
            `;
        }
        res.json({ ok: true });
    } catch (err) {
        console.error('Log medication error:', err);
        res.status(500).json({ error: 'Failed to log medication' });
    }
});

export default router;
