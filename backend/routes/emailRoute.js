import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();
router.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

router.post("/", async (req, res) => {
  const { email, score, total } = req.body;

  if (!email || score === undefined || total === undefined) {
    return res.status(400).json({ success: false, message: "Missing email/score/total" });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Quiz Score",
      text: `Congratulations!!! You scored ${score} out of ${total}.`,
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("sendMail error:", err);
    return res.status(500).json({ success: false, message: err?.message || "sendMail failed" });
  }
});

export default router;