import React, {useState, useEffect } from 'react'

const useKeyPress = (targetCode) => {
  const [keyPressed, setKeyPressed] = useState(false)

  const keyDownHandler = ({keyCode}) => {
    if (keyCode === targetCode) {
      setKeyPressed(true)
    }
  }

  const keyUpHandler = ({keyCode}) => {
    if (keyCode === targetCode) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler )
    document.addEventListener('keyup', keyUpHandler )
    return () => {
      document.removeEventListener('keydown', keyDownHandler )
      document.removeEventListener('keyup', keyUpHandler )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return keyPressed
}

export default useKeyPress
