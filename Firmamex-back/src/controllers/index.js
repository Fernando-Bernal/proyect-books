import axios from "axios";

const searchBooks = async (req, res) => {
  const { book } = req.query;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}&maxResults=7&key=${process.env.APIKEY_BOOKS}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

const generateStory = async (req, res) => {
    const { text1, text2} = req.body;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.APIKEY_GEMINI}`;
        const response = await axios.post(url,{
            contents: [{parts: [{text: `Crea una nueva historia en español combinando los personajes principales de los siguientes libros en solo dos párrafos:\n\n**Texto 1:** ${text1}\n\n**Texto 2:** ${text2}\n\n**Historia combinada (dos párrafos)**:`, },],},],},
          {headers: {"Content-Type": "application/json",},}
        );
        
        let generatedText = response.data.candidates[0].content.parts[0].text;
        res.status(200).json({ generatedText });
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Error generating story. Please try again later." });
      }
}; 

const traslateText = async (req, res) => {
  const { text, languages  } = req.body;
  try {
      let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.APIKEY_GEMINI}`;
      const response = await axios.post(url, {
          contents: [{parts: [{text: `Realiza la traduccion la siguiente historia ${text} al idioma ${languages} y enviame la traduccion, sin ninguna aclaracion`,},],},],
      },
      {
          headers: {"Content-Type": "application/json",},
      });
      let translatedText = response.data.candidates[0].content.parts[0].text;
      res.status(200).json({ translatedText });
  }
  catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Error translating text. Please try again later." });
  }
}



export { searchBooks, generateStory, traslateText };