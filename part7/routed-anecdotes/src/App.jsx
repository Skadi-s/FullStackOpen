import { useState } from 'react'
import { Route, Link, Routes, useMatch, useNavigate } from 'react-router-dom'
import { useField } from './hooks'
import PropTypes from 'prop-types'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const Notification = ({ notification }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
    borderColor: '#4169e1'
  }
  
  if (!notification) {
    return null
  }
  
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.string
}

const Anecdote = ({ anecdote, vote }) => (
  <div>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <p>has {anecdote.votes} votes</p>
    <button onClick={() => vote(anecdote.id)}>vote</button>
    <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
  </div>
)

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired
  }).isRequired,
  vote: PropTypes.func.isRequired
}


const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {
        anecdotes.map(anecdote =>
          <li key={anecdote.id}>
            <Link to={`anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        )
      }
    </ul>
  </div>
)

AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired
    })
  ).isRequired
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is &quot;a story with a point.&quot;</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)



const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('url')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAnecdote = {
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0
    }
    
    addNew(newAnecdote)
    setNotification(`A new anecdote '${content.input.value}' created!`)
    
    setTimeout(() => {
      setNotification('')
    }, 5000)
    
    // 清空表单
    content.reset()
    author.reset()  
    info.reset()
    
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.input} />
        </div>
        <div>
          author
          <input {...author.input} />
        </div>
        <div>
          url for more info
          <input {...info.input} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired
}
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useMatch('anecdotes/:id')
  const anecdote = match ? anecdoteById(Number(match.params.id)) : null

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification} />
        <Routes>
          <Route path='anecdotes/:id' element={<Anecdote anecdote={anecdote} vote={vote} />} />
          <Route path='/' element={ <AnecdoteList anecdotes={anecdotes} /> }/>
          <Route path='/create' element={<CreateNew addNew={addNew} setNotification={setNotification} />} />
          <Route path='/about' element={<About />} />
        </Routes>  
        <Footer/>
    </div>
  )
}

export default App
