import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
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

const ALL_BOOKS_FOR_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  })

  const { data: genresData } = useQuery(ALL_BOOKS_FOR_GENRES)

  if (!props.show) {
    return null
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const books = data.allBooks || []

  // 获取所有可用的类型
  const allGenres = genresData ? 
    [...new Set(genresData.allBooks.flatMap(book => book.genres))] : 
    []

  return (
    <div>
      <h2>books</h2>
      
      {/* 类型筛选按钮 */}
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Filter by genre:</strong></p>
        <button 
          onClick={() => setSelectedGenre(null)}
          style={{ 
            marginRight: '10px',
            marginBottom: '5px',
            backgroundColor: selectedGenre === null ? '#007bff' : '#f8f9fa',
            color: selectedGenre === null ? 'white' : 'black',
            border: '1px solid #007bff',
            padding: '8px 12px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          all genres
        </button>
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              marginRight: '10px',
              marginBottom: '5px',
              backgroundColor: selectedGenre === genre ? '#007bff' : '#f8f9fa',
              color: selectedGenre === genre ? 'white' : 'black',
              border: '1px solid #007bff',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {selectedGenre && (
        <p>Showing books in genre: <strong>{selectedGenre}</strong></p>
      )}

      {books.length === 0 ? (
        <p>No books found{selectedGenre ? ` in genre "${selectedGenre}"` : ''}.</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Books
