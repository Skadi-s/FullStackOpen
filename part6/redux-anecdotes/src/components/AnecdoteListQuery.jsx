import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import anecdoteService from '../services/anecdotes'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteListQuery = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const filter = useSelector(state => state.filter)

  // 使用 React Query 获取轶事数据
  const { data: anecdotes = [], isLoading, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1
  })

  // 投票 mutation
  const voteMutation = useMutation({
    mutationFn: ({ id, anecdote }) => anecdoteService.update(id, anecdote),
    onSuccess: (updatedAnecdote) => {
      // 更新缓存中的数据
      queryClient.setQueryData(['anecdotes'], old =>
        old.map(anecdote =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      )
      dispatch(setNotificationWithTimeout(`you voted '${updatedAnecdote.content}'`, 5))
    },
    onError: () => {
      dispatch(setNotificationWithTimeout('Vote failed', 5))
    }
  })

  // 过滤和排序轶事
  const filteredAndSortedAnecdotes = useMemo(() => {
    const filtered = anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    return filtered.sort((a, b) => b.votes - a.votes)
  }, [anecdotes, filter])

  const vote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteMutation.mutate({ id: anecdote.id, anecdote: updatedAnecdote })
  }

  if (isLoading) return <div>Loading anecdotes...</div>
  if (error) return <div>Error loading anecdotes: {error.message}</div>

  return (
    <div>
      <h2>Anecdotes</h2>
      {filteredAndSortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button 
              onClick={() => vote(anecdote)}
              disabled={voteMutation.isPending}
            >
              {voteMutation.isPending ? 'voting...' : 'vote'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteListQuery
