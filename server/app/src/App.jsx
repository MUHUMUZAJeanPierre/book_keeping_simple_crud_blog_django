import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/books/", {
        headers: {
          'Content-Type': "application/json"
        }
      });
      setBooks(response.data);
    } catch (err) {
      console.log(err);
      
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    setLoading(true);
    try {
      const newBook = { title, release_year: releaseDate };
      const response = await axios.post("http://127.0.0.1:8000/api/books/create/", newBook, {
        headers: {
          'Content-Type': "application/json"
        }
      });
      setBooks(prevBooks => [...prevBooks, response.data]);
      setTitle('');
      setReleaseDate('');
    } catch (err) {
      console.log(err);
      
      setError('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

const updateTitle = async (pk, release_year) => {
  const bookData = {
    release_year,
    title: newTitle,
  };
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.detail || 'Failed to update book'}`);
    }

    const data = await response.json();
    setBooks((prev) =>
      prev.map((book) => (book.id === pk ? data : book))
    );
    setNewTitle(''); // Clear the new title input
  } catch (error) {
    console.error('Update failed:', error);
  }
};

  const deleteBook = async (pk) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, { method: 'DELETE' });
      setBooks(prev => prev.filter(book => book.id !== pk));
    } catch (err) {
      setError('Failed to delete book');
      console.log(err);
      
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <h1>Book Website</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' placeholder='Book Title ...' />
        <input value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} type='number' placeholder='Release Date...' />
        <button onClick={addBook}>Add Book</button>
      </div>
      <div>
        {books.map((book) => (
          <div key={book.id}>
            <h2>Title: {book.title}</h2>
            <p>Release Year: {book.release_year}</p>
            <input onChange={(e) => setNewTitle(e.target.value)} type='text' placeholder='New Title...' />
            <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
            <button onClick={() => deleteBook(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
