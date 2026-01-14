import dotenv from "dotenv";
dotenv.config();

import express from "express";
import postgres from "postgres";
import { initDB } from "./config/db.js";

import emailRoute from "./routes/emailRoute.js";
import historyRoute from "./routes/historyRoute.js";

const app = express(); // ✅ app must be created before app.get/app.use

// ✅ add ping AFTER app is created
app.get("/api/ping", (req, res) => {
  res.status(200).json({ ok: true });
});

const sql = postgres(process.env.DB_URL);

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hey we hit a req, the method is", req.method);
  next();
});

// Register API routes
app.use("/api/send-score-email", emailRoute);
app.use("/api/history", historyRoute);

// ✅ Minimal safer DB init: don't block startup (prevents hanging)
initDB().catch((e) => console.error("DB init failed:", e));

// Local listen (so localhost works)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

export default app;