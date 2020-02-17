const Store = window.require('electron-store')
const fileStore = new Store({ 'name': 'Files Data' })

const setFilesStore = ( files ) => {
    return fileStore.set('files', files)
}

const getFilesStore = () => {
    return fileStore.get('files') || {}
}

export { getFilesStore, setFilesStore }