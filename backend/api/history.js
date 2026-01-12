import { sql } from '../config/db.js';  // Adjust path if db.js is in a different location

export default async function handler(req, res) {
  // Enable CORS (important for mobile app)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Your original getHistoryByUserID logic (simplified for now)
      // Later: Add user ID check from token (Authorization header)
      const result = await sql`SELECT * FROM history ORDER BY timestamp DESC`;
      res.status(200).json(result);
    } catch (err) {
      console.error('GET history error:', err);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  } else if (req.method === 'POST') {
    const { link, result } = req.body;

    if (!link || !result) {
      return res.status(400).json({ error: 'Link and result required' });
    }

    try {
      const newEntry = await sql`
        INSERT INTO history (link, result) 
        VALUES (${link}, ${result}) 
        RETURNING *
      `;
      res.status(201).json(newEntry[0]);
    } catch (err) {
      console.error('POST history error:', err);
      res.status(500).json({ error: 'Failed to save history' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}