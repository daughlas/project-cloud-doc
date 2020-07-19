import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TabList.styl'

const TabList = ({files, activeId, unSaveIds, onTabClick, onTabClose}) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map(file => {
        const fClassName = classNames({
          'nav-link': true,
          'active': file.id === activeId
        })
        return (
          <li className="nav-item" key={file.id}>
            <a
              onClick={(e) => {e.preventDefault();onTabClick(file.id)}}
              href="#1"
              className={fClassName}
            >
              {file.title}
              <FontAwesomeIcon
                className="ml-2 close-icon"
                icon={faTimes}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )

}

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unSaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onTabClose: PropTypes.func
}

export default TabList
