import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.error('Error adding book:', error.message)
    },
    onCompleted: (data) => {
      console.log('Book added successfully:', data.addBook)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !author.trim() || !published || genres.length === 0) {
      alert('Please fill in all fields and add at least one genre')
      return
    }

    try {
      await addBook({
        variables: {
          title: title.trim(),
          author: author.trim(),
          published: parseInt(published),
          genres: genres
        }
      })

      // 清空表单
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
      
      // 成功消息将通过订阅显示
    } catch (error) {
      console.error('Failed to add book:', error)
      alert('Failed to add book. Please try again.')
    }
  }

  const addGenre = () => {
    if (genre.trim() && !genres.includes(genre.trim())) {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  const removeGenre = (genreToRemove) => {
    setGenres(genres.filter(g => g !== genreToRemove))
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>
        <div>
          genre
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addGenre()
              }
            }}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>
          genres: {genres.map(g => (
            <span key={g} style={{ marginRight: '10px' }}>
              {g}
              <button 
                type="button" 
                onClick={() => removeGenre(g)}
                style={{ marginLeft: '5px', fontSize: '12px' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook