import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
const [books, setBooks] = useState([])
const [title, setTitle] = useState('')
const [releaseDate, setReleaseData] = useState('')
const [newTitle, setNewTitle] = useState('')

const fetchBooks = async ()=>{
  try {
   const response = await axios.get("http://127.0.0.1:8000/api/books/", {
    headers:{
      'Content-Type':"application/json"
    }
   })
   const data = response.data;
   console.log(data);
   setBooks(data);
   
  } catch (error) {
    console.log(error);
    
  }
}
const addBook = async()=>{
  try {
    const newBook = {
      title,
      release_year: releaseDate
    }
    const response = await axios.post("http://127.0.0.1:8000/api/books/create/", newBook, {
      headers:{
        'Content-Type':"application/json"
      }
    })
    setBooks((prevBooks)=> [...prevBooks,response.data])
    setTitle('');
    setReleaseData('');
  } catch (error) {
    console.error(error);
    
  }
}

const updateTitle = async(pk, release_year)=>{
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/books/${pk}/`,{
      title: newTitle,
      release_year: release_year,
    },
    {
      headers:{
        'Content-Type':'application/json'
      }
    }
  );
  console.log('Updated book', response.data);
  setBooks((prevBooks)=>
  prevBooks.map((book)=>
  book.id === pk? {...book, title: newTitle} : book))
  } catch (error) {
    console.error(error);
    
  }
}


useEffect(()=>{
  fetchBooks()
}, [])


  return (
    <>
    <h1>Book Website</h1>
    <div>
      <input value={title} onChange={(e)=>setTitle(e.target.value)} type='text ' placeholder='Book Tittle ...' />
      <input value={releaseDate} onChange={(e)=>{setReleaseData(e.target.value)}} type='number' placeholder='Release Date...' />
      <button onClick={addBook}>Add Book</button>
    </div>

    <div>
      {books.map((book)=>(
        <div key={book.id}>
          <h2>Title: {book.title}</h2>
          <p>Release Year: {book.release_year}</p>
          <input  onChange={(e)=>setNewTitle(e.target.value)} type='text' placeholder='New Title...' />
          <button onClick={()=>updateTitle(book.id, book.release_year)}>Change Title</button>
        </div>
      ))}
    </div>
    </>
  )
}

export default App
