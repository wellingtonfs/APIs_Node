const Path = require('./path')
const fs = require('fs')

function listfolders() {
    let folders = []

    try {
        if (!fs.existsSync(Path.dirData)) return folders

        folders = fs.readdirSync(Path.dirData, { withFileTypes: true })
            .filter(file => file.isDirectory())
            .map(file => file.name)
    } catch (e) {
        console.log(e)
    }
    
    return folders
}

function listfiles(folder) {
    let files = []
    const pathfiles = Path.join([Path.dirData, folder])

    try {
        if (!fs.existsSync(pathfiles)) return files

        files = fs.readdirSync(pathfiles, { withFileTypes: true })
            .filter(file => !file.isDirectory())
            .map(file => file.name)
    } catch (e) {
        console.log(e)
    }
    
    return files
}

function getFileDetails(folder, file) {
    let details;

    const pathfile = Path.join([Path.dirData, folder, file])

    try{
        if (!fs.existsSync(pathfile)) return null

        details = fs.statSync(pathfile)

        let escala = 'KB'
        let size = details.size
        size = size / 1024.0

        if (size >= 1000) { size = size / 1024.0; escala = 'MB' }
        if (size >= 1000) { size = size / 1024.0; escala = 'GB' } 

        size = size.toFixed((size >= 100) ? 1 : 2)

        let mtime = new Date(details.mtimeMs)

        return {
            name: file,
            sizeStr: `${size.toString()} ${escala}`,
            mtime: mtime.toLocaleString('pt-BR')
        }
    } catch (e) {
        console.log(e)
    }

    return null
}

const funcsFolder = {
    listdirs: listfolders,
    listfiles: listfiles,
    getFileDetails: getFileDetails
}

module.exports = funcsFolder