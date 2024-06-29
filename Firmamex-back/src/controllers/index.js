import axios from "axios";

const searchBooks = async (req, res) => {
  const { book } = req.query;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

const generateStory = async (req, res) => {
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
};

export { searchBooks, generateStory };