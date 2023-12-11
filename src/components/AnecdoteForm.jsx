import { useQuery, useMutation, useQueryClient, QueryClientProvider } from '@tanstack/react-query'
import { addNewAnecdote } from '../requests'
import NotificationContext from "./NotificationContext"
import { useContext } from 'react'

const AnecdoteForm = () => {

  const [notification, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: addNewAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"])
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      notificationDispatch({type: "MESSAGE", payload: error.response.data.error})
      setTimeout(() => {
        notificationDispatch({type: "CLEAR"})
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
