import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'

import useKeyPress from '../hooks/useKeyPress'

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
  const [ value, setValue ] = useState('')
  const [ editStatus, setEditStatus ] = useState(false)

  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  const closeSearch = () => {
    setEditStatus(false)
    setValue('')
  }

  useEffect(() => {
    if (enterPressed && editStatus) {
      const editItem = files.find(file => file.id === editStatus)
      onSaveEdit(editItem.id, value)
      setEditStatus(false)
      setValue(false)
    }
    if (escPressed && editStatus) {
      closeSearch()
    }
  }, [editStatus, enterPressed, escPressed, files, onSaveEdit, value])



  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li
            className="list-group-item bg-light d-flex justify-content-between align-items-center file-item"
            key={file.id}
          >
            {
              file.id === editStatus &&
              (<>
                <input
                  value={value}
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
              </>)
            }
            {
              (file.id !== editStatus) &&
              (<>
                <div className="flex-1" onClick={() => {onFileClick(file.id)}}>
                  <FontAwesomeIcon icon={faMarkdown} className="mr-10"/>
                  <span className="c-link">{file.title}</span>
                </div>
                <div>
                  <button className="icon-button">
                    <FontAwesomeIcon onClick={() => {setEditStatus(file.id);setValue(file.title)}} title="编辑" icon={faEdit}/>
                  </button>
                  <button className="icon-button">
                    <FontAwesomeIcon onClick={() => {onFileDelete(file.id)}} title="删除" icon={faTrash}/>
                  </button>
                </div>
              </>)
            }
          </li>
        ))
      }
    </ul>
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func
}

export default FileList
