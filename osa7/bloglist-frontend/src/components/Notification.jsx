import { useMessageValue, useMessageDispatch } from '../MessageContext'
let timeoutId = undefined

const Notification = () => {
  const message = useMessageValue()
  const dispatch = useMessageDispatch()

  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  //aiheuttaa sivun uudelleenrenderöitymisen 5 sek välein :(
  timeoutId = setTimeout(() => {
    dispatch({ type: 'HIDE' })
  }, 5000)

  return <div className={message.type}>{message.content}</div>
}

export default Notification
