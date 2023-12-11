import { useQuery, useMutation, useQueryClient, QueryClientProvider } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAllAnecdotes, updateAnecdote } from './requests'
import { useReducer, useContext } from 'react'
import NotificationContext from './components/NotificationContext'

const App = () => {

  const initialState = null

  const notificationReducer = (state, action) => {
    switch (action.type) {
      case "MESSAGE":
        return action.payload
      case "CLEAR":
        return initialState
      default:
        return state
    }
}

  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  const queryClient = useQueryClient()

  const handleVote = (anecdote) => {
    const anecdoteToUpdate = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(anecdoteToUpdate)
    notificationDispatch({type: "MESSAGE", payload: `You voted for ${anecdote.content}`})
    setTimeout(() => {
      notificationDispatch({type: "CLEAR"})
    }, 5000);
  }

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map((anecdote) => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
    }
  })

   const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAllAnecdotes,
  })

  if (result.isLoading) {
    return <div>loading data</div>
  }

  if (result.isError) {
    return <div>anecdotes not loaded due to problem on server</div>
  }

  const anecdotes = result.data
  
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
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
    </NotificationContext.Provider>
  )
}

export default App
