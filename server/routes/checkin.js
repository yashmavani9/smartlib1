import express from 'express';
import Student from '../models/Student.js';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
  const { roll_no, book_id, action } = req.body;

  if (!roll_no || !book_id || !action) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const student = await Student.findOne({ roll_no });

    if (!student) {
      return res.status(404).json({ message: 'Student not found in DB.' });
    }

    const ngrokUrl = process.env.NGROK_URL;

    const response = await fetch(`${ngrokUrl}/koha-checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roll_no, book_id, action }),
    });

    const data = await response.json();
    res.status(200).json({ message: 'Request sent to Koha.', koha_response: data });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
