import React, { useState, useRef, useEffect } from 'react'
import useKeyPress from '../hooks/useKeyPress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const FileSearch = ( { title, onFileSearch } ) => {
    const [inputActive, setInputActive] = useState(false)
    const [value, setValue] = useState('')
    const inputEl = useRef(null)
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const onCloseInput = () => {
        setInputActive(false)
        setValue('')
    }

    useEffect(() => {
        if ( enterPressed && inputActive ) {
            onFileSearch(value)
        } else if ( escPressed && inputActive ) {
            onCloseInput()
        }
    })

    useEffect(() => {
        if ( inputActive ) {
            inputEl.current.focus()
        }
    }, [inputActive])


    return <div className="alert alert-primary m-0">
        {
            !inputActive
                ? <div className="d-flex  align-items-center justify-content-between flex-row">
                    <span>{title}</span>
                    <button type="button"
                            className="icon-button"
                            onClick={() => setInputActive(true)}>
                        <FontAwesomeIcon icon={faSearch}
                                         size="lg"
                                         title="搜索"/>
                    </button>
                </div>
                : <div className="row">
                    <input type="text"
                           value={value}
                           ref={inputEl}
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
    </div>
}

export default FileSearch