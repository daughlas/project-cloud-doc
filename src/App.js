import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

import './App.css';

function App() {
  const [ files, setFiles ] = useState(defaultFiles)
  const [ activeFileID, setActiveFileId ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIds, setUnsavedFileIDs ] = useState([])
  const openedFiles = openedFileIDs.map(openID => {
    return files.find(file => file.id === openID)
  })
  const activeFile = files.find(file => file.id === activeFileID)

  const fileClickHandler = (fileID) => {
    // set current active file
    setActiveFileId(fileID)
    // if openedFiles don't have current ID
    // add new fileID to openedFiles
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }

  const tabClickHandler = (fileID) => {
    // set current active file
    setActiveFileId(fileID)
  }

  const tabCloseHandler = (id) => {
    // remove current id from openedFileIDs
    const tabsWithout = openedFileIDs.filter(fileId => fileId !== id)
    setOpenedFileIDs(tabsWithout)
    // set the active to the first opened tab if still tabs left
    if (tabsWithout.length > 0) {
      setActiveFileId(tabsWithout[0])
    } else {
      setActiveFileId('')
    }
  }

  const fileChangeHandler = (id, value) => {
    // loop through file array to update to new value
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.body = value
      }
      return file
    })
    setFiles(newFiles)
    // update unsavedIDs
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIds, id])
    }
  }


  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {console.log(value)}}
          >
          </FileSearch>
          <FileList
            files={files}
            onFileClick={(id) => fileClickHandler(id)}
            onFileDelete={(id) => console.log('delete' + id)}
            onSaveEdit={(id, newVal) => {console.log(id);console.log(newVal)}}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary no-border"
                icon={faPlus}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success no-border"
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile && 
            (<div className="start-page">选择或者创建新的 Markdown 文档</div>)
          }
          { activeFile &&
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unSaveIds={unsavedFileIds}
                onTabClick={tabClickHandler}
                onTabClose={tabCloseHandler}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => fileChangeHandler(activeFile.id, value)}
                options={{
                  minHeight: '515px'
                }}
              />
            </>
          }
          
        </div>
      </div>
    </div>
  ); 
}

export default App;
