import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes"

export const getAllAnecdotes = () =>
    axios.get(baseUrl).then((response) => response.data)

export const addNewAnecdote = (anecdote) => 
    axios.post(baseUrl, anecdote).then((response) => response.data)

export const updateAnecdote = (anecdote) =>
    axios.put(`${baseUrl}/${anecdote.id}`, anecdote).then((response) => response.data)
