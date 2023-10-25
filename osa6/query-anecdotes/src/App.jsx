import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useMessageDispatch } from './MessageContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'SUCCESS',
        payload: `anecdote '${content}' voted`
      })
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  

  if ( isLoading ) {
    return <div>loading data...</div>
  }

  if ( isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
