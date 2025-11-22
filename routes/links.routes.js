import express from "express";
import {
  createLink,
  getAllLinks,
  deleteLink,
  getStats,
} from "../controller/links.controller.js";

const router = express.Router();

// REST APIs
router.post("/links", createLink);
router.get("/links", getAllLinks);
router.delete("/links/:code", deleteLink);
// Health Check
router.get("/links/:code", getStats);

export default router;
