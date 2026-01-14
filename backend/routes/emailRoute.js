import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

//const transporter = nodemailer.createTransport({
//  service: 'gmail',
 // auth: {
  //  user: process.env.EMAIL_USER,
  //  pass: process.env.EMAIL_PASS,
 // },
//});

//replacethis later
router.post('/', express.json(), async (req, res) => {
  console.log("Received send-score-email request body:", req.body);
  res.status(200).json({ success: true });
});

// Temporarily commenting this email sender
/* router.post('/', async (req, res) => {
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
*/
export default router;