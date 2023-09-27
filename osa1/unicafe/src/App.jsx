import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text, value}) => {
  if (text=="positive") {
    return (
      <tr>
          <td>{text}</td>
          <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
  )       
}

const Statistics = ({good, neutral, bad, total}) => {
  if (total==0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  
  const average = () => (good - bad) / total
  const positive = () => good / total * 100

  return (
    <div>   
      <table> 
        <tbody>      
        <StatisticLine text="good" value ={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={total} />
        <StatisticLine text="average" value ={average().toFixed(1)} />
        <StatisticLine text="positive" value ={positive().toFixed(1)} /> 
        </tbody> 
      </table>  
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={handleGoodClick} text='good'/>
        <Button handleClick={handleNeutralClick} text='neutral'/>
        <Button handleClick={handleBadClick} text='bad'/>
      </div>
      <h1>statistics</h1>
      <div>
        <Statistics good={good} neutral={neutral} bad={bad} total={total}/>
      </div>
    </div>
  )
}

export default App
