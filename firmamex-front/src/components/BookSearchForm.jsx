import React, { useState } from "react";
import axios from "axios";

const BookSearchForm = ({ onSendBooks }) => {
    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [results1, setResults1] = useState([]);
    const [results2, setResults2] = useState([]);
    const [selectedBook1, setSelectedBook1] = useState(null);
    const [selectedBook2, setSelectedBook2] = useState(null);
    const [generatedStory, setGeneratedStory] = useState("");
   
    const handleSearch1 = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/books?book=${query1}`
            );
            setResults1(response.data.items || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleSearch2 = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/books?book=${query2}`
            );
            setResults2(response.data.items || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleSelectBook1 = (book) => {
        setSelectedBook1(book);
    };

    const handleSelectBook2 = (book) => {
        setSelectedBook2(book);
    };

    const handleSubmit = async () => {
        if (selectedBook1 && selectedBook2) {
            try {
                const response = await axios.post(
                    "http://localhost:3000/generate-story",
                    {
                        text1: selectedBook1.volumeInfo.description,
                        text2: selectedBook2.volumeInfo.description,
                    }
                );
                const storyText = response.data.generatedText;
                setGeneratedStory(storyText);
            } catch (error) {
                console.error("Error generating story:", error);
            }
        } else {
            alert("Por favor, selecciona dos libros.");
        }
    };

    return (
        <div>
            <div>
                <h3>Buscar Libro 1</h3>
                <input
                    type="text"
                    value={query1}
                    onChange={(e) => setQuery1(e.target.value)}
                    placeholder="Buscar libro 1..."
                />
                <button onClick={handleSearch1}>Buscar</button>
                <ul>
                    {results1.map((book) => (
                        <li
                            key={book.id}
                            onClick={() => handleSelectBook1(book)}
                        >
                            {book.volumeInfo.title}
                        </li>
                    ))}
                </ul>
                {selectedBook1 && (
                    <p>Seleccionado: {selectedBook1.volumeInfo.title}</p>
                )}
            </div>

            <div>
                <h3>Buscar Libro 2</h3>
                <input
                    type="text"
                    value={query2}
                    onChange={(e) => setQuery2(e.target.value)}
                    placeholder="Buscar libro 2..."
                />
                <button onClick={handleSearch2}>Buscar</button>
                <ul>
                    {results2.map((book) => (
                        <li
                            key={book.id}
                            onClick={() => handleSelectBook2(book)}
                        >
                            {book.volumeInfo.title}
                        </li>
                    ))}
                </ul>
                {selectedBook2 && (
                    <p>Seleccionado: {selectedBook2.volumeInfo.title}</p>
                )}
            </div>

            <button onClick={handleSubmit}>Enviar Libros Seleccionados</button>
            {generatedStory && (
                <div>
                    <h3>Historia Generada</h3>
                    <p>{generatedStory}</p>
                </div>
            )}
        </div>
    );
};

export default BookSearchForm;
