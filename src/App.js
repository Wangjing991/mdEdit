import React, { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import "easymde/dist/easymde.min.css"
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { flattenArr, objToArr, timestampToString } from './utils/helper'
import fileHelper from './utils/fileHelper'
import SimpleMDE from "react-simplemde-editor"
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import useIpcRenderer from './hooks/useIpcRenderer'
import defaultFiles from './configs/defaultFiles'

import { setFilesStore, getFilesStore } from './stores/index'

const { join } = window.require('path')
const { remote } = window.require('electron')
const saveLocationPath = remote.app.getPath('documents')

let uniqueId = 1

const saveFilesToStore = ( files ) => {
    // we don't have to store any info in file system, eg: isNew, body ,etc
    const filesStoreObj = objToArr(files).reduce(( result, file ) => {
        const { id, path, title, createdAt, isSynced, updatedAt } = file
        result[id] = {
            id,
            path,
            title,
            createdAt,
            isSynced,
            updatedAt
        }
        return result
    }, {})
    setFilesStore(filesStoreObj)
}

const newFileConfig = ( data ) => {
    const newID = +new Date() + '-' + (++uniqueId)
    const defaultFile = {
        id: newID,
        title: '新建文件',
        body: '## 请输出 Markdown',
        createdAt: new Date().getTime(),
        path: saveLocationPath,
        isNew: true
    }
    return {
        [newID]: { ...defaultFile, ...data }
    }
}

function App() {
    const [files, setFiles] = useState(getFilesStore)
    const [activeFileID, setActiveFileID] = useState('')
    const [openedFileIDs, setOpenedFileIDs] = useState([])
    const [unsavedFileIDs, setUnsavedFileIDs] = useState([])
    const [searchedFiles, setSearchedFiles] = useState([])
    const [isLoading, setLoading] = useState(false)
    let filesArr = objToArr(files)
    //  更新 files
    const updateFiles = ( files ) => {
        saveFilesToStore(files)
        console.log(setFiles(files), 'setFiles(files)')
    }


    const createNewFile = () => {
        updateFiles({ ...files, ...newFileConfig() })
        // saveFile(newID)
    }

    const deleteFileItem = ( id ) => {
        delete files[id]
        updateFiles({ ...files })
    }

    const saveFileName = ( id, title ) => {
        const item = files[id]
        // console.log(id, title, item)
        if ( item && item.title ) {
            fileHelper.renameFile(
                join(saveLocationPath, `${item.title}.md`),
                join(saveLocationPath, `${title}.md`)
            ).then(res => {
                console.log('重命名成功')
            })
        } else {
            fileHelper.writeFile(join(saveLocationPath, `${title}.md`), item.body).then(res => {
                console.log(res, '新建成功')
            })
        }
        updateFiles({ ...files, [id]: { ...files[id], title } })
    }

    const handleClickFile = ( id ) => {
        const currItem = files[id]
        console.log(currItem, 'readClickFile')
        if ( !currItem.isLoaded ) {
            fileHelper.readFile(join(currItem.path, currItem.title + '.md')).then(( res = '' ) => {
                currItem.isLoaded = true
                currItem.body = res
                setFiles({ ...files, [id]: currItem })
                setActiveFileID(id)
                if ( !openedFileIDs.includes(id) ) {
                    setOpenedFileIDs([...openedFileIDs, id])
                }
            })
        } else {
            setActiveFileID(id)
            if ( !openedFileIDs.includes(id) ) {
                setOpenedFileIDs([...openedFileIDs, id])
            }
        }
    }

    const fileChange = ( value ) => {
        files[activeFileID].body = value
    }

    const saveFile = ( id ) => {
        console.log(JSON.stringify(files), id, '===')
        const currFile = files[id]
        fileHelper.writeFile(join(saveLocationPath, `${currFile.title}.md`), currFile.body)
    }

    const handleCloseTab = ( id ) => {
        if ( activeFileID === id ) {
            setActiveFileID('')
        }
        const currIdx = openedFileIDs.indexOf(id)
        openedFileIDs.splice(currIdx, 1)
        setOpenedFileIDs([...openedFileIDs])
    }

    const importFiles = () => {
        remote.dialog.showOpenDialog({
            title: '选择导入的 Markdown 文件',
            properties: ['openFile', 'multiSelections'],
            filters: [
                { name: 'Markdown files', extensions: ['md'] }
            ]
        }).then(result => {
            if ( result.canceled === false ) {
                const newFiles = result.filePaths.reduce(( obj, it ) => {
                    const arr = it.split('/'),
                        title = arr[arr.length - 1].split('.')
                    arr.pop()
                    title.pop()

                    console.log(arr.join('/'))
                    obj = { ...obj, ...newFileConfig({ path: arr.join('/'), title: title.join() }) }
                    return obj
                }, {})
                console.log(newFiles, 'newFiles=====newFIles')
                updateFiles({ ...files, ...newFiles })
            }
            console.log(result.canceled)
            console.log(result.filePaths)
        }).catch(err => {
            console.log(err)
        })
    }

    useIpcRenderer({
        'create-new-file': createNewFile,
        'import-file': importFiles,
    })

    return (
        <div className="App container-fluid">
            <div className="row">
                <div className="col-3 left-panel px-0">
                    <FileSearch title="请输入文件名" onFileSearch={( value ) => {
                        console.log(value)
                    }}/>
                    <FileList lists={filesArr}
                              onFileDelete={deleteFileItem}
                              onSaveFileName={saveFileName}
                              onFileClick={handleClickFile}
                    />
                    <div className="row no-gutters button-group">
                        <div className="col">
                            <BottomBtn
                                text="新建"
                                colorClass="btn-primary"
                                icon={faPlus}
                                onBtnClick={createNewFile}
                            />
                        </div>
                        <div className="col">
                            <BottomBtn
                                text="导入"
                                colorClass="btn-success"
                                icon={faFileImport}
                                onBtnClick={importFiles}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-9 right-panel">
                    <TabList
                        activeId={activeFileID}
                        onTabClick={handleClickFile}
                        onCloseTab={handleCloseTab}
                        files={filesArr.filter(it => openedFileIDs.includes(it.id))}
                    />
                    {
                        activeFileID ? <SimpleMDE
                            onChange={fileChange}
                            key={activeFileID}
                            value={activeFileID && files[activeFileID] && files[activeFileID].body}
                            options={{
                                minHeight: '515px',
                                autofocus: true,
                                spellChecker: false
                            }}
                            label="Your label"
                        /> : null
                    }

                    <div className="col">
                        <BottomBtn
                            text="保存"
                            colorClass="btn-success"
                            icon={faFileImport}
                            onBtnClick={() => saveFile(activeFileID)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
