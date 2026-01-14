import dotenv from "dotenv";
dotenv.config();

import express from "express";
import postgres from "postgres";
import { initDB } from "./config/db.js";
import emailRoute from "./routes/emailRoute.js";
import historyRoute from "./routes/historyRoute.js";

const app = express();

app.use(express.json());  // MUST BE BEFORE ANY ROUTES

// Ping route for health check
app.get("/api/ping", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/send-score-email", emailRoute);
app.use("/api/history", historyRoute);

const sql = postgres(process.env.DB_URL);
const PORT = process.env.PORT || 3000;

await initDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
}

export default app;