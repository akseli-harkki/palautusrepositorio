import { createSlice } from "@reduxjs/toolkit"

let timeoutId = undefined

const notificationSlice = createSlice({
  name: 'notificaton',
  initialState: ['', 'none'],
  reducers: {
    notificationChange(state, action) {
      return action.payload
    }
  }
})

export const { notificationChange } = notificationSlice.actions

export const setNotification = (message, time) => {
  return dispatch => {
    dispatch(notificationChange(message))

    if(timeoutId) {
      clearTimeout(timeoutId)
    }  
    
    timeoutId = setTimeout(() => {
      dispatch(notificationChange(['', 'none']))
    }, time * 1000)
  }
}

export default notificationSlice.reducer