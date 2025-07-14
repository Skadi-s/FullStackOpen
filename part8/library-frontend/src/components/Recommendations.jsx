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

const ME = gql`
  query {
    me {
      username
      favouriteGenre
    }
  }
`

const Recommendations = ({ show }) => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(ME)
  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(ALL_BOOKS, {
    variables: { genre: userData?.me?.favouriteGenre },
    skip: !userData?.me?.favouriteGenre
  })

  if (!show) {
    return null
  }

  if (userLoading) return <p>Loading user data...</p>
  if (userError) return <p>Error loading user data: {userError.message}</p>

  if (!userData?.me) {
    return <p>Please log in to see recommendations.</p>
  }

  const favouriteGenre = userData.me.favouriteGenre

  if (booksLoading) return <p>Loading recommendations...</p>
  if (booksError) return <p>Error loading books: {booksError.message}</p>

  const books = booksData?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre <strong>{favouriteGenre}</strong></p>
      
      {books.length === 0 ? (
        <p>No books found in your favourite genre.</p>
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

export default Recommendations
