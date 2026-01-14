import dotenv from "dotenv";
dotenv.config();

console.log('CLERK_JWT_KEY:', process.env.CLERK_JWT_KEY?.substring(0, 30));

import express from "express";
import postgres from "postgres";
import { initDB } from "./config/db.js";
import emailRoute from './routes/emailRoute.js';
import historyRoute from "./routes/historyRoute.js";

const app = express();   

app.use('/api/send-score-email', emailRoute);

// Add ping route here, before other routes:
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
app.use("/api/history", historyRoute);

await initDB();  // initialize DB connection once at module load time

if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port', process.env.PORT || 3000);
  });
}

export default app;  // export the express app as the serverless handler