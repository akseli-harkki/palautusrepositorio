import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  return (
    <div className={notification[1]}>
      {notification[0]}
    </div>
  )
}

export default Notification