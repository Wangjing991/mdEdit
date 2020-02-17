const fs = window.require('fs').promises

const fileHelper = {
    readFile: ( path ) => {
        return fs.readFile(path, { encoding: 'utf8' })
    },
    writeFile: ( path, content ) => {
        return fs.writeFile(path, content, { encoding: 'utf8' })
    },
    renameFile: ( path, newPath ) => {
        return fs.rename(path, newPath)
    },
    deleteFile: ( path ) => {
        return fs.unlink(path)
    }
}

export default fileHelper
// fileHelper.readFile('./helper.js').then(res => {
//     console.log(res)
// })
//
// fileHelper.writeFile('./test.md', 'hello word').then(res => {
//     console.log(res, 'writeFile')
// })
//
// fileHelper.renameFile('./hello_word.md', 'test.md').then(res => {
//     console.log(res, 'writeFile')
// })
//
// fileHelper.deleteFile('./test.md').then(res => {
//     console.log(res, 'deleteFile')
// })