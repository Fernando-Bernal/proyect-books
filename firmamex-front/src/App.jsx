import React, { useState } from 'react';
import BookSearchForm from './components/BookSearchForm.jsx';

const App = () => {
  const [books, setBooks] = useState({ book1: null, book2: null });

  const handleSendBooks = (book1, book2) => {
    setBooks({ book1, book2 });
    // Aquí puedes manejar el envío a la API de generación de historias
  };

  return (
    <div className="App">
      <h1>Generador de Historias con Libros</h1>
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
    </div>
  );
};

export default App;