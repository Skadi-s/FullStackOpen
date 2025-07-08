import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import anecdoteService from '../services/anecdotes'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteFormQuery = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  // 创建轶事 mutation
  const createMutation = useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      // 更新缓存中的轶事列表
      queryClient.setQueryData(['anecdotes'], old => [...old, newAnecdote])
      dispatch(setNotificationWithTimeout(`you created '${newAnecdote.content}'`, 5))
    },
    onError: (error) => {
      dispatch(setNotificationWithTimeout(`Error: ${error.response?.data?.error || 'Failed to create anecdote'}`, 5))
    }
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    if (content.trim().length < 5) {
      dispatch(setNotificationWithTimeout('Anecdote must be at least 5 characters long', 5))
      return
    }
    
    event.target.anecdote.value = ''
    createMutation.mutate(content)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input 
            name="anecdote" 
            placeholder="Enter an anecdote..."
            disabled={createMutation.isPending}
          />
        </div>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'creating...' : 'create'}
        </button>
      </form>
    </div>
  )
}

export default AnecdoteFormQuery
