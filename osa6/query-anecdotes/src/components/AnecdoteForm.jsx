import { useContext } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useMessageDispatch } from "../MessageContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'SUCCESS',
        payload: `anecdote'${content}' added`
      })
    },
    onError: (error) => {      
      if (error.response.data.error) {
        dispatch({
        type: 'ERROR',
        payload: error.response.data.error
        })
        } else {
        dispatch({
          type: 'ERROR',
          payload: error.message
        })  
      }     
    }
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
