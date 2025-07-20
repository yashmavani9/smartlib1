import express from 'express';
import Student from '../models/Student.js';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
  const { patron_id, barcode, action } = req.body;

  if (!patron_id || !barcode || !action) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const student = await Student.findOne({ roll_no: patron_id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const endpoint = action === 'checkout' ? '/checkout' : '/checkin'; // future check-in
    const ngrokUrl = process.env.NGROK_URL + endpoint;

    const flaskRes = await fetch(ngrokUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patron_id, barcode }),
    });

    const data = await flaskRes.json();
    return res.status(200).json({ message: data.message || 'Request processed', status: data.status });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
