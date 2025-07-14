import { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error editing author:', error.message)
    },
    onCompleted: (data) => {
      console.log('Author updated successfully:', data.editAuthor)
      setName('')
      setBorn('')
    }
  })

  if (!props.show) {
    return null
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const authors = data.allAuthors
  if (!authors || authors.length === 0) {
    return <p>No authors found.</p>
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!name || !born) {
      alert('Please select an author and enter birth year')
      return
    }

    try {
      await editAuthor({
        variables: {
          name,
          setBornTo: parseInt(born)
        }
      })
    } catch (error) {
      alert('Failed to update author birth year')
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">Select author</option>
            {authors.map(a => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            placeholder="Enter birth year"
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}
Authors.propTypes = {
  show: PropTypes.bool.isRequired
}

export default Authors
