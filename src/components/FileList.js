import React, { useState, useRef, useEffect, Fragment } from 'react'
import useKeyPress from '../hooks/useKeyPress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from '../utils/helper'

const FileList = ( { lists = [], onFileClick, onFileDelete, onSaveFileName } ) => {
    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const onCloseInput = () => {
        setEditStatus(false)
        setValue('')
    }

    const clickNode = useContextMenu([
        {
            id: 'open',
            label: '打开',
            click: () => {
                const currNode = getParentNode(clickNode.current, 'file-item')
                if ( currNode ) {
                    onFileClick(currNode.dataset.id)
                }
            }
        },
        {
            id: 'edit',
            label: '重命名',
            click: () => {
                const currNode = getParentNode(clickNode.current, 'file-item')
                if ( currNode ) {
                    setEditStatus(currNode.dataset.id);
                    setValue(currNode.dataset.title)
                }
            }
        },
        {
            id: 'delete',
            label: '删除',
            click: ( e ) => {
                console.log(e, 'delete')
                const currNode = getParentNode(clickNode.current, 'file-item')
                if ( currNode ) {
                    onFileDelete(currNode.dataset.id)
                }
            }
        }
    ], '.file-list')

    useEffect(() => {
        if ( enterPressed && editStatus ) {
            onSaveFileName(editStatus, value)
            onCloseInput()
        } else if ( escPressed && editStatus ) {
            onCloseInput()
        }
    })

    return <ul className="list-group list-group-flush file-list px-0">
        {
            lists.length ? lists.map(file => {
                    return <li
                        className="list-group-item bg-light row d-flex justify-content-between file-item mx-0"
                        key={file.id}
                        data-id={file.id}
                        data-title={file.title}
                    >
                        {
                            editStatus !== file.id
                                ? <Fragment>
                                    <span>
                                        <FontAwesomeIcon
                                            size="lg"
                                            icon={faMarkdown}
                                        />
                                    </span>
                                    <span className="col-10 c-link"
                                          onClick={() => {
                                              onFileClick(file.id)
                                          }}>
                                        {file.title}
                                    </span>
                                </Fragment>
                                : <div className="row">
                                    <input type="text"
                                           value={value}
                                           className="col-8"
                                           onChange={( e ) => setValue(e.target.value)}
                                    />
                                    <button type="button"
                                            className="icon-button col-4"
                                            onClick={onCloseInput}>
                                        <FontAwesomeIcon icon={faTimes}
                                                         size="lg"
                                                         title="关闭"/>
                                    </button>
                                </div>
                        }
                    </li>
                })
                : null
        }
    </ul>
}

export default FileList