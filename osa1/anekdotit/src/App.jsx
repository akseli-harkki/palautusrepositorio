import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const RandomNumber = (max, selected) => { 
  let number = Math.floor(Math.random() * max)
  while (number==selected) {
    number = Math.floor(Math.random() * max)
  }
  return number
}

const AnecdoteWithMostVotes = ({votes, anecdotes, totalVotes}) => {
  if (totalVotes==0) {
    return (
      <div>
        No votes yet
      </div>
    )
  }
  
  let mostVoted = votes[0]
  let mostVotedIndex = 0
  for (let i = 1; i < votes.length; i++) {
    if (votes[i] > mostVoted) {
      mostVoted = votes[i]
      mostVotedIndex = i
    }
  }

  return (
    <div>
      {anecdotes[mostVotedIndex]}
      <p>has {mostVoted} votes</p>
    </div>
  )  
}  

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  let arrayOfZeroes = Array(anecdotes.length).fill(0)  
  const [votes, setVotes] = useState(arrayOfZeroes)
  const [selected, setSelected] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)

  const handleNextAnecdoteClick = () => {
    setSelected(RandomNumber(anecdotes.length, selected))
  }

  const handleVoteClick = () => {
    const copy = votes
    copy[selected] += 1
    setVotes(copy)
    //makes the display of votes dynamic, without this the vote counter would only refresh when "next anecdote" was clicked 
    setTotalVotes(totalVotes + 1) 
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={handleVoteClick} text="vote"/>
      <Button handleClick={handleNextAnecdoteClick} text="next anecdote"/>
      <h1>Anecdote with the most votes</h1>
      <AnecdoteWithMostVotes votes={votes} anecdotes={anecdotes} totalVotes={totalVotes}/>
    </div>
  )
}

export default App
