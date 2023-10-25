import { createContext, useReducer, useContext } from 'react'

const messageReducer = (state = ['', 'none'], action) => {
  switch (action.type) {
    case "ERROR":
      return [action.payload, 'error']
    case "SUCCESS":
      return [action.payload, 'success']
    case "NONE":
      return [action.payload, 'none']
    default:
      return state  
  }
}

const MessageContext = createContext()

export const MessageContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, 0)

  return (
    <MessageContext.Provider value={[message, messageDispatch] }>
      {props.children}
    </MessageContext.Provider>
  )
}

export const useMessageValue = () => {
  const messageAndDispatch = useContext(MessageContext)
  return messageAndDispatch[0]
}

export const useMessageDispatch = () => {
  const messageAndDispatch = useContext(MessageContext)
  return messageAndDispatch[1]
}

export default MessageContext