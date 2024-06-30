import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const BookSearchForm = ({ onSendBooks }) => {
    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [results1, setResults1] = useState([]);
    const [results2, setResults2] = useState([]);
    const [selectedBook1, setSelectedBook1] = useState(null);
    const [selectedBook2, setSelectedBook2] = useState(null);
    const [generatedStory, setGeneratedStory] = useState("");
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState("español");

    const handleSearch1 = async () => {
        try {
            const response = await axios.get(
                `https://proyect-books-k2u6.vercel.app/books?book=${query1}`
            );
            setResults1(response.data.items || []);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleSearch2 = async () => {
        try {
            const response = await axios.get(
                `https://proyect-books-k2u6.vercel.app/books?book=${query2}`
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

     const handleSelectLanguages = (e) => {
        setLanguages(e.target.value); 
    };
    const handleSubmit = async () => {
        if (selectedBook1 && selectedBook2) {
            setLoading(true);
            const maxRetries = 4;
            let attempts = 0;
            let success = false;
    
            while (attempts < maxRetries && !success) {
                try {
                    const response = await axios.post(
                        "https://proyect-books-k2u6.vercel.app/generate-story",
                        {
                            text1: selectedBook1.volumeInfo.title ?? selectedBook1.volumeInfo.description,
                            text2: selectedBook2.volumeInfo.title ?? selectedBook2.volumeInfo.description,
                        }
                    );
                    const storyText = response.data.generatedText;
                    setGeneratedStory(storyText);
                    success = true; // Si llegamos aquí, la historia se generó correctamente 
                } catch (error) {
                    attempts += 1;
                    console.error(`Error generating story (Attempt ${attempts}):`, error);
                    if (attempts < maxRetries) {
                        // Esperar un tiempo antes de reintentar (e.g., 2 segundos)
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        alert("Hubo un problema generando la historia. Por favor, intenta de nuevo más tarde.");
                    }
                } finally {
                    if (success) {
                        setLoading(false);
                    }
                }
            }
        } else {
            alert("Por favor, selecciona dos libros.");
        }
    };

    const handleTranslate = async () => {
        if (generatedStory) {
            setLoading(true);
            const maxRetries = 4;
            let attempts = 0;
            let success = false;

            while (attempts < maxRetries && !success) {
                try {
                    const response = await axios.post(
                        "https://proyect-books-k2u6.vercel.app/translate-text",
                        {
                            text: generatedStory,
                            languages,
                        }
                    );
                    const translatedText = response.data.translatedText;
                    setGeneratedStory(translatedText);
                    success = true;
                } catch (error) {
                    attempts += 1;
                    console.error(`Error translating story (Attempt ${attempts}):`, error);
                    if (attempts < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        alert("Hubo un problema traduciendo la historia. Por favor, intenta de nuevo más tarde.");
                    }
                } finally {
                    if (success) {
                        setLoading(false);
                    }
                }
            }
        }
    }



    return (
        <Conteiner>
            <DivInputs>
                <ColumnInput>
                    {results1.length === 0 ? (
                        <H3>Buscar Libro 1</H3>
                    ) : (
                        <H3>Elija un Libro</H3>
                    )}
                    <ContenedorBuscador>
                        <Input
                            type="text"
                            value={query1}
                            onChange={(e) => setQuery1(e.target.value)}
                            placeholder="Buscar..."
                        />
                        <ButtonInput onClick={handleSearch1}>
                            Buscar
                        </ButtonInput>
                    </ContenedorBuscador>
                    <DivUl>
                        {results1.map((book) => (
                            <ul
                                key={book.id}
                                onClick={() => handleSelectBook1(book)}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    <img
                                        src={
                                            book.volumeInfo.imageLinks
                                                ?.thumbnail ||
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAOVBMVEWoqa3///+kpamhoqb6+vrAwcP39/etrrLz8/Tq6uvU1NXb29zd3t/Nzc/w8PHHx8i0tbi7vMDk5OWv5McUAAADZUlEQVR4nO2b25KqMBBFTQeIiHLx/z/2iFOUjKL0bcc5VVkvvO5Kdzp943AoFAqFQqFQKBQKhUKh4ANRjJFm5s+31dygmKaha5twp+q7S52+LIwOw/UYnmjay+FruihO52dBC9f6O7JobN9Jmmmn/KrieP0k6UdWzKuJLtWeppvbn3IeFqWPlnvQj9lk0fRy497R1JlUxZoraeaSxbHiRaIphFMGVSQ6p/tZwS0o14RXRUmuKQTwHUy9RtQxITXFTqPp9hQCnV3jUD8MQAOqjDfTwySRMEKtgUWr2OhFBZAmy0GF0IG8ipkabIMJCzRZNIEuYHybkPNoEa5OjFzzIwD7Wa0HsR+drKLOAKfarV72aP016fKDNY2/U41WP7+lVf6izJqCf82szloeuF8/fSr1wL1gpqGI+o9FeTi6f/3nIMq/2eERp7w1HdJfjOh/8u0jc5ZwddfkkE8B6hkyezqi02gqRW9UkGrGaD9I58VaOYD6xKYKGdR3sb3JqOlDZPf0X6lQrSDLUQHHNOqojuvkGVIF5PBPG6s67ChEFRaQxrujeGyqhJ6DTOJkr8LP/OSvTZ1ltiY7qyHLFJJGgV9VuUbuNLLz9ZyTbW7C3h6yLgHUDBNWyNnVFnF/otWkvBsclE6cDY5uzLeGE8eOGxXOY57ToiSa2XY57l8chK9fBd/hoFGREjfYw4qcDaUNgKsl7A2lV2CRPWpMt9Bg3kDbCBmz8SLdUHrFv8oi5ULJGu+Bn4cmb1VkHGovXB1V2VuLC34tRmu77Jcqp8jgMVV74BMZyGFQu8alCkyGOL5F4zB4IFNTcYvefFSeTr5gvoLmZZItjG5F5jHRFo1JE8J4M2dLtJL3fZgYDBjdb97CUX1UHhP2d6iTK++wuUY7JvXLDbZQ+johNSlX9LAHpTwqpEfNVIqHGX1QqnwvouLmA7EoZIxaEMcq/zTqFfHIBpKyPFPLNKHSg98ItwJiDk0hiJzKvr3MQ9Ro9yrT92glotDRfEFSbuWynsh+2r+b5Ajun3UrSQBflOp/OR1sp8rx7i2wmzC5AsIMf3sww2O80HOzYsng2gzXqbJFqRlmrWwdLchgJsXWn65kMMNnhLR/3tEwReFLhjXMQJVVE/P6OazDS2BdP99e/j6shyZvRNis/v4B6+Uvx4fhy+cAAAAASUVORK5CYII="
                                        }
                                        alt={book.volumeInfo.title}
                                        style={{
                                            width: "60px",
                                            marginRight: "10px",
                                        }}
                                    />
                                    <span>{book.volumeInfo.title}</span>
                                </div>
                            </ul>
                        ))}
                    </DivUl>

                    {selectedBook1 && (
                        <Msj>
                            Seleccionaste: {selectedBook1.volumeInfo.title}
                        </Msj>
                    )}
                </ColumnInput>

                <ColumnInput>
                    {results2.length === 0 ? (
                        <H3>Buscar Libro 2</H3>
                    ) : (
                        <H3>Elija un Libro</H3>
                    )}
                    <ContenedorBuscador>
                        <Input
                            type="text"
                            value={query2}
                            onChange={(e) => setQuery2(e.target.value)}
                            placeholder="Buscar..."
                        />
                        <ButtonInput onClick={handleSearch2}>
                            Buscar
                        </ButtonInput>
                    </ContenedorBuscador>
                    <DivUl>
                        {results2.map((book) => (
                            <ul
                                key={book.id}
                                onClick={() => handleSelectBook2(book)}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                    <img
                                        src={
                                            book.volumeInfo.imageLinks
                                                ?.thumbnail ||
                                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAOVBMVEWoqa3///+kpamhoqb6+vrAwcP39/etrrLz8/Tq6uvU1NXb29zd3t/Nzc/w8PHHx8i0tbi7vMDk5OWv5McUAAADZUlEQVR4nO2b25KqMBBFTQeIiHLx/z/2iFOUjKL0bcc5VVkvvO5Kdzp943AoFAqFQqFQKBQKhUKh4ANRjJFm5s+31dygmKaha5twp+q7S52+LIwOw/UYnmjay+FruihO52dBC9f6O7JobN9Jmmmn/KrieP0k6UdWzKuJLtWeppvbn3IeFqWPlnvQj9lk0fRy497R1JlUxZoraeaSxbHiRaIphFMGVSQ6p/tZwS0o14RXRUmuKQTwHUy9RtQxITXFTqPp9hQCnV3jUD8MQAOqjDfTwySRMEKtgUWr2OhFBZAmy0GF0IG8ipkabIMJCzRZNIEuYHybkPNoEa5OjFzzIwD7Wa0HsR+drKLOAKfarV72aP016fKDNY2/U41WP7+lVf6izJqCf82szloeuF8/fSr1wL1gpqGI+o9FeTi6f/3nIMq/2eERp7w1HdJfjOh/8u0jc5ZwddfkkE8B6hkyezqi02gqRW9UkGrGaD9I58VaOYD6xKYKGdR3sb3JqOlDZPf0X6lQrSDLUQHHNOqojuvkGVIF5PBPG6s67ChEFRaQxrujeGyqhJ6DTOJkr8LP/OSvTZ1ltiY7qyHLFJJGgV9VuUbuNLLz9ZyTbW7C3h6yLgHUDBNWyNnVFnF/otWkvBsclE6cDY5uzLeGE8eOGxXOY57ToiSa2XY57l8chK9fBd/hoFGREjfYw4qcDaUNgKsl7A2lV2CRPWpMt9Bg3kDbCBmz8SLdUHrFv8oi5ULJGu+Bn4cmb1VkHGovXB1V2VuLC34tRmu77Jcqp8jgMVV74BMZyGFQu8alCkyGOL5F4zB4IFNTcYvefFSeTr5gvoLmZZItjG5F5jHRFo1JE8J4M2dLtJL3fZgYDBjdb97CUX1UHhP2d6iTK++wuUY7JvXLDbZQ+johNSlX9LAHpTwqpEfNVIqHGX1QqnwvouLmA7EoZIxaEMcq/zTqFfHIBpKyPFPLNKHSg98ItwJiDk0hiJzKvr3MQ9Ro9yrT92glotDRfEFSbuWynsh+2r+b5Ajun3UrSQBflOp/OR1sp8rx7i2wmzC5AsIMf3sww2O80HOzYsng2gzXqbJFqRlmrWwdLchgJsXWn65kMMNnhLR/3tEwReFLhjXMQJVVE/P6OazDS2BdP99e/j6shyZvRNis/v4B6+Uvx4fhy+cAAAAASUVORK5CYII="
                                        }
                                        alt={book.volumeInfo.title}
                                        style={{
                                            width: "60px",
                                            marginRight: "10px",
                                        }}
                                    />
                                    <span>{book.volumeInfo.title}</span>
                                </div>
                            </ul>
                        ))}
                    </DivUl>
                    {selectedBook2 && (
                        <Msj>
                            Seleccionaste: {selectedBook2.volumeInfo.title}
                        </Msj>
                    )}
                </ColumnInput>
            </DivInputs>
            <ButtonGenerar onClick={handleSubmit} disabled={loading}>
                {loading ? "Generando..." : "Generar Historia"}
            </ButtonGenerar>
            {generatedStory && (
                <>
            <H2>Si te gusto la historia y quieres leerla en otro idioma, elije a cual y traducela</H2>
            <DivButtons>
            <Select value={languages} onChange={handleSelectLanguages}>
                <option value="español">Español</option>
                <option value="inglés">Inglés</option>
                <option value="francés">Francés</option>
                <option value="italiano">Italiano</option>
            </Select>
            <ButtonGenerar onClick={handleTranslate} disabled={loading}>
                {loading ? "Generando..." : "Traducir Historia"}
            </ButtonGenerar>
            </DivButtons>
            </>
             )}
            {generatedStory && (
                <GeneratedStory>{generatedStory}</GeneratedStory>
            )}
        </Conteiner>
    );
};

const Conteiner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const DivInputs = styled.div`
    display: flex;
    width: 80%;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-direction: column;
    }

`;

const ColumnInput = styled.div`
    flex: 1;
    margin: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ContenedorBuscador = styled.div`
    display: flex;
    align-items: center;
`;

const H3 = styled.h3`
    font-size: 18px;
    margin-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 16px;
        color: #074a27;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
`;

const ButtonInput = styled.button`
    padding: 7px 20px;
    background: linear-gradient(90deg, #0158b4, #8f49da);
    color: white;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background: linear-gradient(90deg, #0056b3, #5500b3);
    }
`;

const DivUl = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin-top: 10px;

    ul {
        cursor: pointer;

        span{
            @media (max-width: 768px) {
                color: #074a27;
                font-size: 14px;
            }
        }
    }

    ul:hover {
        background-color: #f1f1f1;
    }
`;

const Msj = styled.div`
    margin-top: 10px;
    font-size: 14px;
    color: #074a27;
    font-weight: bold;
`;

const DivButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 60%;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const ButtonGenerar = styled.button`
    max-height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px 20px;
    background: linear-gradient(45deg, #28a745, #17a2b8);
    color: white;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background: linear-gradient(45deg, #218838, #117a8b);
    }
`;


const Select = styled.select`
    max-height: 40px;
    margin-top: 20px;
    padding: 10px 20px;
    background: linear-gradient(45deg, #28a745, #17a2b8);
    color: white;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background: linear-gradient(45deg, #359b4b, #117a8b);
    }

    option{
        background: #347643;
        color: white;
    
    }

`;

const H2 = styled.h2`
    font-size: 15px;
    margin-bottom: 0px;

    @media (max-width: 768px) {
        font-size: 14px;
        color: #074a27;
        width: 80%;
    }    
`;

const GeneratedStory = styled.div`
    width: 80%;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    white-space: pre-wrap;
    text-align: justify;
    cursor: default;

    @media (max-width: 768px) {
        font-size: 14px;
        width: 80%;
        color: #074a27;
    }
`;

export default BookSearchForm;
