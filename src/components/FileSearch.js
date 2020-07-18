import React, {useState} from 'react'

const FileSearch = ({title, onFileSearch}) => {
    const [inputActive, setInputActive] = useState(false)
    const [ value, setValue ] = useState('')

    return (
        <div className="alert alert-primary">
            { !inputActive &&
                <div>
                    <span>{title}</span>
                    <button className="btn btn-primary" type="button">搜索</button>
                </div>
                
            }
        </div>
    )
}

export default FileSearch
