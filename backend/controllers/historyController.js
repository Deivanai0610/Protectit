import { sql } from "../config/db.js";
import { verifyToken } from "@clerk/clerk-sdk-node";

async function getUserIdFromToken(authHeader) {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const jwtPayload = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
    });
    return jwtPayload.sub; // User ID
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getHistory(req, res) {
  try {
    const user_id = await getUserIdFromToken(req.headers.authorization);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const historyvalue = await sql`
      SELECT * FROM history WHERE user_id = ${user_id} ORDER BY created_at DESC
    `;
    res.status(200).json(historyvalue);
  } catch (error) {
    console.error("Error getting history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createLinkHistory(req, res) {
  try {
    const user_id = await getUserIdFromToken(req.headers.authorization);
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const { link, result } = req.body;
    if (!link || !result) return res.status(400).json({ message: "Link and result are required" });

    const historyvalue = await sql`
      INSERT INTO history (user_id, link, result) VALUES (${user_id}, ${link}, ${result}) RETURNING *
    `;
    res.status(201).json(historyvalue[0]);
  } catch (error) {
    console.error("Error creating history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteLinkHistory(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid link ID provided" });
    }

    const result = await sql`
      DELETE FROM history WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "History not found" });
    }

    res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}