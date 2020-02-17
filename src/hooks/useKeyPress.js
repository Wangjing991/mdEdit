import { useState, useEffect } from 'react'

const useKeyPress = ( targetKeyCode ) => {
    const [keyPressed, setKeyPressed] = useState(false)

    const keyDownHandler = ( e ) => {
        if ( e.keyCode === targetKeyCode ) {
            setKeyPressed(true)
        }
    }
    const keyUpHandler = ( e ) => {
        if ( e.keyCode === targetKeyCode ) {
            setKeyPressed(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('keyup', keyUpHandler)
        }
    }, [])
    return keyPressed
}

export default useKeyPress