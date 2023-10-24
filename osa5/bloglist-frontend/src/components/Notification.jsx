const Notification = ({ message, setMessage }) => {
  if (message.length === 0) {
    return null
  }

  setTimeout(() => {
    setMessage([])
  }, 5000)

  return (
    <div className={message[1]}>
      {message[0]}
    </div>
  )
}

export default Notification