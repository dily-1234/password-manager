import express from "express";
import { decrptyPost } from "../controllers/passwords.js";
const router = express.Router();

router.post("/", decrptyPost);

export default router;
