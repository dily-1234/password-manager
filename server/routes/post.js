import express from "express";
import {
  getPosts,
  createPosts,
  decrptyPost,
  deletePosts,
  editPosts,
} from "../controllers/passwords.js";
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPosts);
router.put("/", editPosts);
router.delete("/", deletePosts);
router.post("/", decrptyPost);

export default router;
