const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create table if not exists (runs on startup)
pool.query(`
  CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    link TEXT NOT NULL,
    result TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log('Database table ready')).catch(err => console.error('Table creation error:', err));

// GET all history (for History screen)
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM history ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new history entry (called from PhishingChecker)
app.post('/api/history', async (req, res) => {
  const { link, result } = req.body;
  if (!link || !result) {
    return res.status(400).json({ error: 'Link and result required' });
  }
  try {
    const newEntry = await pool.query(
      'INSERT INTO history (link, result) VALUES ($1, $2) RETURNING *',
      [link, result]
    );
    res.json(newEntry.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoints: http://localhost:${PORT}/api/history (GET/POST)`);
});