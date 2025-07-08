import AnecdoteListQuery from './components/AnecdoteListQuery'
import AnecdoteFormQuery from './components/AnecdoteFormQuery'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  return (
    <div>
      <h1>Programming anecdotes</h1>
      <Notification />
      <Filter />
      <AnecdoteListQuery />
      <AnecdoteFormQuery />
    </div>
  )
}

export default App