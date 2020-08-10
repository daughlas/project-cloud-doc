import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import {faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";
import { v4 as uuidv4 } from 'uuid';
import "easymde/dist/easymde.min.css"

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import { objToArr } from './utils/helper.js'
import fileHelper from './utils/fileHelper'
import './App.css';

// require node.js modules
const { join } = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')

const fileStore = new Store({
  name: 'Files Data'
})

const saveFilesToStore = (files) => {
  // 新建、重命名、删除 的时候进行持久化操作
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file
    result[id] = {id, path, title, createdAt}
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [ files, setFiles ] = useState( fileStore.get('files') || {})
  const [ activeFileID, setActiveFileId ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  const [ unsavedFileIds, setUnsavedFileIDs ] = useState([])
  const [ searchedFiles, setSearchedFiles ] = useState([])
  const filesArr = objToArr(files)
  const savedLocation = remote.app.getPath('documents')
  const activeFile = files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  

  const fileSearchHandler = keyword => {
    // filter out the files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const fileClickHandler = (fileID) => {
    // set current active file
    setActiveFileId(fileID)
    const currentFile = files[fileID]
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(val => {
        const newFile = {...files[fileID], body: val, isLoaded: true}
        setFiles({...files, [fileID]: newFile})
      })
    }
    // if openedFiles don't have current ID
    // add new fileID to openedFiles
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
  }

  const deleteFileHandler = (id) => {
    if (files[id].isNew) {
      // not so good method
      // delete files[id]
      const {[id]: value , ...afterDelete } = files
      setFiles(afterDelete)
    } else {
      // filter out the current file id
      fileHelper.deleteFile(files[id].path).then(() => {
        const {[id]: value , ...afterDelete } = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        // close the tab if open
        tabCloseHandler(id)
      })
    }
   
    
  }

  const UpdateFileName = (id, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`)
    // select active file & update the title
    const modifiedFile = {...files[id], title, isNew: false, path: newPath}
    const newFiles = {...files, [id]: modifiedFile}
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`)
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
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
    const newFile = {...files[id], body: value}
    setFiles({...files, [id]: newFile})
    // update unsavedIDs
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIds, id])
    }
  }

  const createFileHandler = () => {
    const newId = uuidv4()
    const newFile = {
      id: newId,
      title: '',
      body: '## 请输入 markdown',
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({...files, [newId]: newFile})
  }

  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的 markdown 文件',
      properties: []
    })
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(
      join( savedLocation, `${activeFile.title}.md`),
      activeFile.body
    ).then(() => {
      setUnsavedFileIDs(unsavedFileIds.filter(id => id !== activeFileID ))
    })
  }
  
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel bg-light">
          <FileSearch
            title="我的云文档"
            onFileSearch={fileSearchHandler}
          >
          </FileSearch>
          <FileList
            files={fileListArr}
            onFileClick={fileClickHandler}
            onFileDelete={deleteFileHandler}
            onSaveEdit={UpdateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                onBtnClick={createFileHandler}
                colorClass="btn-primary no-border"
                icon={faPlus}
              />
            </div>
            <div className="col">
              <BottomBtn
                onBtnClick={importFiles}
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
              <BottomBtn
                onBtnClick={saveCurrentFile}
                text="保存"
                colorClass="btn-success no-border"
                icon={faSave}
              />
            </>
          }
          
        </div>
      </div>
    </div>
  ); 
}

export default App;
