import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author
      published
    }
  }
`

const Books = (props) => {
  if (!props.show) {
    return null
  }
  
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const books = data.allBooks

  if (!books || books.length === 0) {
    return <p>No books found.</p>
  }

  return (
    <div>
      <h2>books</h2>
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
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
