import express from "express";
import dotenv from "dotenv";
import postgres from "postgres";
import { initDB } from "./config/db.js";

import historyRoute from "./routes/historyRoute.js";

dotenv.config();

const app = express();                     // <- app creation must be before usage
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

export default app;  // export the express app as the serverless handler