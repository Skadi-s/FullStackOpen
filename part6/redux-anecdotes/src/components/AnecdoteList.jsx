import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useMemo } from "react"

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()
    
    const vote = (id) => {
        dispatch({
        type: 'VOTE',
        data: { id }
        })
    }

    const sortedAnecdotes = useMemo(() => {
        return [...anecdotes].sort((a, b) => b.votes - a.votes)
    }, [anecdotes])
    
    return (
        <div>
        <h2>Anecdotes</h2>
        {sortedAnecdotes.map(anecdote =>
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