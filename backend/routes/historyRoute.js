import express from "express";
import {createLinkHistory, deleteLinkHistory, getHistory} from "../controllers/historyController.js"

const router = express.Router();

router.get("/", getHistory);
router.post("/", createLinkHistory);
router.delete("/:id", deleteLinkHistory);

export default router;