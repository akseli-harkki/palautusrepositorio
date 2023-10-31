import { createContext, useReducer, useContext } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'ERROR':
      return (state = {
        content: action.payload.content,
        type: 'error',
      })
    case 'SUCCESS':
      return (state = {
        content: action.payload.content,
        type: 'success',
      })
    case 'HIDE':
      return (state = {
        content: '',
        type: 'none',
      })
  }
}

const MessageContext = createContext()

export const MessageContextProvider = (props) => {
  const [message, messageDispatch] = useReducer(messageReducer, {
    content: '',
    type: '',
  })

  return (
    <MessageContext.Provider value={[message, messageDispatch]}>
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
