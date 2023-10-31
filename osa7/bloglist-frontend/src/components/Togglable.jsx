import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  let hideWhenVisible = ''
  let showWhenVisible = ''

  if (visible) {
    hideWhenVisible = 'hide'
    showWhenVisible = 'show-container'
  } else {
    hideWhenVisible = 'show-container'
    showWhenVisible = 'hide'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div className={hideWhenVisible}>
        <button className='btn btn-open' onClick={toggleVisibility}>
          {props.buttonLabelOpen}{' '}
        </button>
      </div>
      <div className={showWhenVisible}>
        {props.children}
        <button className='btn btn-close' onClick={toggleVisibility}>
          {props.buttonLabelClose}
        </button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabelOpen: PropTypes.string.isRequired,
  buttonLabelClose: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
