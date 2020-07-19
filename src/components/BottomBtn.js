import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomBtn = ({text, colorClass, icon, onBtnClick}) => {
  return (
    <button 
      type="button"
      onClick={onBtnClick}
      className={`btn btn-block no-border ${colorClass}`}
    >
      <FontAwesomeIcon
        className="mr-2"
        icon={icon}
      />
      {text}
    </button>
  )
}

BottomBtn.propTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onBtnClick: PropTypes.func
}

BottomBtn.defaultProps = {
  text: '新建'
}

export default BottomBtn