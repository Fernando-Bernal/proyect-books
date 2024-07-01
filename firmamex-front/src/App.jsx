import React, { useState } from "react";
import BookSearchForm from "./components/BookSearchForm.jsx";
import styled from "styled-components";

const App = () => {
    const [books, setBooks] = useState({ book1: null, book2: null });

    const handleSendBooks = (book1, book2) => {
        setBooks({ book1, book2 });
        // Aquí puedes manejar el envío a la API de generación de historias
    };

    return (
        <ConteinerApp>
                <Title>Generador de historias</Title>
            <BookSearchForm onSendBooks={handleSendBooks} />
            <div>
                {books.book1 && books.book2 && (
                    <div>
                        <h2>Libros Seleccionados</h2>
                        <p>{books.book1.volumeInfo.title}</p>
                        <p>{books.book2.volumeInfo.title}</p>
                        {/* Aquí puedes agregar el botón para generar la historia */}
                    </div>
                )}
            </div>
        </ConteinerApp>
    );
};

export default App;

const ConteinerApp = styled.div`
    display: flex;
    width: 100vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    `;

const Title = styled.h1`
    text-align: center;
    margin: 0 auto;
    font-size: 2.5rem;
    color: #ffffff;
    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;
