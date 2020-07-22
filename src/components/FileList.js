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

  const closeSearch = (editItem) => {
    setEditStatus(false)
    setValue('')
    // if we are editing a newly created file, we should delete thile file
    if (editItem.isNew) {
      onFileDelete(editItem.id)
    }
  }

  useEffect(() => {
    const editItem = files.find(file => file.id === editStatus)
    if (enterPressed && editStatus && value.trim() !== '') {
      onSaveEdit(editItem.id, value, editItem.isNew)
      setEditStatus(false)
      setValue('')
    }
    if (escPressed && editStatus) {
      closeSearch(editItem)
    }
  // eslint-disable-next-line
  }, [enterPressed, escPressed, editStatus, files, onSaveEdit, value])

  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if (newFile) {
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])

  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li
            className="list-group-item bg-light d-flex justify-content-between align-items-center file-item"
            key={file.id}
          >
            {
              (file.id === editStatus || file.isNew) &&
              (<>
                <input
                  value={value}
                  placeholder="请输入文件名称"
                  onChange={(e) => { setValue(e.target.value) }}
                  className="form-control"
                />
                <button
                  onClick={() => {closeSearch(file)}}
                  className="icon-button"
                  type="button"
                >
                  <FontAwesomeIcon size="lg" title="关闭" icon={faTimes} />
                </button>
              </>)
            }
            {
              (file.id !== editStatus && !file.isNew) &&
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
