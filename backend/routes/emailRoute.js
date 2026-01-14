import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post('/', async (req, res) => {
  const { email, score, total } = req.body;

  if (!email || !score || !total) {
    return res.status(400).json({ success: false, message: 'Missing email or score values' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Congratulations on Your Quiz Score!',
      text: `Bravo! You scored ${score} out of ${total} in the phishing quiz. Keep up the great work!`,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default router;