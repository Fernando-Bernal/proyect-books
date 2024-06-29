import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/books", (req, res) => {
  let name = req.query.book;
  let url = `https://www.googleapis.com/books/v1/volumes?q=${name}&key=${process.env.APIKEY_BOOKS}`;

  axios.get(url)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

router.post("/generate-story", async (req, res) => {
  const { text1, text2 } = req.body;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.APIKEY_GEMINI}`;

    const response = await axios.post(url,{
        contents: [{parts: [{text: `Crea una nueva historia en español combinando los personajes principales de los siguientes libros en solo dos párrafos:\n\n**Texto 1:** ${text1}\n\n**Texto 2:** ${text2}\n\n**Historia combinada (dos párrafos)**:`, },],},],},
      {headers: {"Content-Type": "application/json",},}
    );
    
    let generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({ generatedText });
  } catch (error) {
    console.error("Error:", error.message);
  }
});
export default router;
