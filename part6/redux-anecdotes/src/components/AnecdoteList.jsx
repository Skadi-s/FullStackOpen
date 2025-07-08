import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()
    
    const vote = (id) => {
        dispatch(voteAnecdote(id))
    }

    const filteredAndSortedAnecdotes = useMemo(() => {
        const filtered = anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
        return filtered.sort((a, b) => b.votes - a.votes)
    }, [anecdotes, filter])
    
    return (
        <div>
        <h2>Anecdotes</h2>
        {filteredAndSortedAnecdotes.map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
            </div>
        )}
        </div>
    )
}

export default AnecdoteList