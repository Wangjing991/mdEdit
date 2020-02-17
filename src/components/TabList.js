import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ( { files, activeId, unsaveIds, onTabClick, onCloseTab } ) => {
    return (
        <ul className="nav nav-pills tablist-component">
            {files.length ? files.map(file => {
                    const withUnsavedMark = unsaveIds.includes(file.id)
                    const fClassName = classNames({
                        'nav-link': true,
                        'active': file.id === activeId,
                        'withUnsaved': withUnsavedMark
                    })
                    return (
                        <li className="nav-item" key={file.id}>
                        <span
                            className={fClassName}
                            onClick={( e ) => {
                                e.preventDefault();
                                onTabClick(file.id)
                            }}
                        >
                            {file.title}
                            <span
                                className="ml-2 close-icon"
                                onClick={( e ) => {
                                    e.stopPropagation();
                                    onCloseTab(file.id)
                                }}>
                            <FontAwesomeIcon
                                icon={faTimes}
                            />
                        </span>
                            {withUnsavedMark && <span className="rounded-circle ml-2 unsaved-icon"></span>}
                        </span>
                        </li>
                    )
                })
                : <div className="alert alert-primary text-center w-100">
                    暂未打开文件
                </div>
            }
        </ul>
    )
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string || PropTypes.number,
    unsaveIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func,
}
TabList.defaultProps = {
    unsaveIds: []
}

export default TabList