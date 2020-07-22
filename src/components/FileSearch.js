import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')

  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  const closeSearch = () => {
    setInputActive(false)
    setValue('')
    onFileSearch('')
  }

  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }
  })

  useEffect(() => {
    if (inputActive) {
      node.current.focus()
    }
  }, [inputActive])

  let node = useRef(null)

  return (
    <div className="alert alert-primary align-items-center d-flex justify-content-between mb-0">
      {!inputActive &&
        <>
          <span>{title}</span>
          <button
            onClick={() => { setInputActive(true) }}
            className="icon-button"
            type="button"
          >
            <FontAwesomeIcon size="lg" title="搜索" icon={faSearch} />
          </button>
        </>

      }
      {inputActive &&
        <>
          <input
            value={value}
            ref={node}
            onChange={(e) => { setValue(e.target.value) }}
            className="form-control"
          />
          <button
            onClick={closeSearch}
            className="icon-button"
            type="button"
          >
            <FontAwesomeIcon size="lg" title="关闭" icon={faTimes} />
          </button>
        </>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch
