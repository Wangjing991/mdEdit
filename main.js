const menuTemplate = require('./src/menuTemplate')
const { app, Menu, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
let mainWindow
let urlLocation = ''

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 680,
        webPreferences: {
            nodeIntegration: true
        }
    })

    let menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    if ( isDev ) {
        urlLocation = 'http://localhost:3000'
        mainWindow.webContents.openDevTools()
    } else {
        urlLocation = `file://${path.join(__dirname, './index.html')}`
    }
    mainWindow.loadURL(urlLocation)

})