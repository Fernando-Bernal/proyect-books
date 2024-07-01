import React, { useState } from "react";
import BookSearchForm from "./components/BookSearchForm.jsx";
import styled from "styled-components";

const App = () => {
    const [books, setBooks] = useState({ book1: null, book2: null });

    const handleSendBooks = (book1, book2) => {
        setBooks({ book1, book2 });
        
    };

    return (
        <ConteinerApp>
                <Title>Generador de historias</Title>
            <BookSearchForm onSendBooks={handleSendBooks} />
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
