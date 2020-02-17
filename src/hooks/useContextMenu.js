import { useRef, useEffect } from 'react'

const { remote } = window.require('electron')

const { Menu, MenuItem } = remote
const useContextMenu = ( menus, targetSelector = 'div' ) => {
    const currNode = useRef(null)
    useEffect(() => {
        const menu = new Menu()
        menus.forEach(it => {
            menu.append(new MenuItem(it))
        })
        const handleContextMenu = ( e ) => {
            console.log(e, '====handlememnu')
            currNode.current = e.target
            e.preventDefault()
            if ( document.querySelector(targetSelector).contains(e.target) ) {
                menu.popup({ window: remote.getCurrentWindow() })
            }
        }
        window.addEventListener('contextmenu', handleContextMenu)
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])
    return currNode
}

export default useContextMenu