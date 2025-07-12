import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        <button onClick={() => setPage('add')}>Add Book</button>
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && <NewBook />}
    </div>
  )
}

const Authors = () => {
  const authors = [
    { name: 'Robert Martin', born: 1952, bookCount: 2 },
    { name: 'Martin Fowler', born: 1963, bookCount: 1 },
    { name: 'Fyodor Dostoevsky', born: 1821, bookCount: 2 },
    { name: 'Joshua Kerievsky', bookCount: 1 },
    { name: 'Sandi Metz', bookCount: 1 },
  ]

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map(author => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Books = () => {
  const books = [
    {
      title: 'Clean Code',
      published: 2008,
      author: 'Robert Martin',
      genres: ['refactoring']
    },
    {
      title: 'Agile software development',
      published: 2002,
      author: 'Robert Martin',
      genres: ['agile', 'patterns', 'design']
    },
    {
      title: 'Refactoring, edition 2',
      published: 2018,
      author: 'Martin Fowler',
      genres: ['refactoring']
    },
    {
      title: 'Refactoring to patterns',
      published: 2008,
      author: 'Joshua Kerievsky',
      genres: ['refactoring', 'patterns']
    },
    {
      title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
      published: 2012,
      author: 'Sandi Metz',
      genres: ['refactoring', 'design']
    },
    {
      title: 'Crime and punishment',
      published: 1866,
      author: 'Fyodor Dostoevsky',
      genres: ['classic', 'crime']
    },
    {
      title: 'The Demon',
      published: 1872,
      author: 'Fyodor Dostoevsky',
      genres: ['classic', 'revolution']
    },
  ]

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const submit = (event) => {
    event.preventDefault()
    
    console.log('add book...', { title, author, published, genres })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            Add Genre
          </button>
        </div>
        <div>Genres: {genres.join(' ')}</div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  )
}

export default App
