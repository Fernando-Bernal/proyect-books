import { Router } from "express";
import { getBooks, generateStory } from "../controllers/index.controller";

const router = Router();

router.get("/books", getBooks);
router.post("/generate-story", generateStory);

export default router;
