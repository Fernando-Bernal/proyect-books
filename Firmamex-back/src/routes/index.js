import { Router } from "express";
import { searchBooks, generateStory } from "../controllers/index.js";

const router = Router();

router.get("/books", searchBooks);
router.post("/generate-story", generateStory);

export default router;
