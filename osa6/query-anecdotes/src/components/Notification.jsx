import { useContext } from "react"
import { useMessageDispatch, useMessageValue } from "../MessageContext"
let timeoutId = undefined

const Notification = () => {  
  const notification = useMessageValue()
  const dispatch = useMessageDispatch()

  if(notification[1] === 'none') {
    return null
  }  
  
  if(timeoutId) {
    clearTimeout(timeoutId)
  }  
  
  timeoutId = setTimeout(() => {
    dispatch({
      type: 'NONE',
      payload: ''
    })
  }, 5000)

  return (
    <div className={notification[1]}>
      {notification[0]}
    </div>
  )
}

export default Notification
