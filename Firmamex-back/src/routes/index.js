import { Router } from "express";
import { searchBooks, generateStory, traslateText } from "../controllers/index.js";

const router = Router();

router.get("/books", searchBooks);
router.post("/generate-story", generateStory);
router.post("/translate-text", traslateText);

export default router;
