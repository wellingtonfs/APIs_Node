const Path = require('../util/path')
const fs = require('fs')

class FileService {
    constructor () {
        if (!fs.existsSync(Path.dirData))
            fs.mkdirSync(Path.dirData)
        if (!fs.existsSync(Path.dirBackup))
            fs.mkdirSync(Path.dirBackup)
    }

    listFolders() {
        let folders = []
    
        try {
            if (!fs.existsSync(Path.dirData)) return { error: `erro desconhecido` }
    
            folders = fs.readdirSync(Path.dirData, { withFileTypes: true })
                .filter(file => file.isDirectory())
                .map(file => file.name)
        } catch (e) {
            console.log(e)
            return { error: `erro desconhecido` }
        }
        
        return { folders }
    }
    
    listFiles(folder) {
        let files = []
        const pathfiles = Path.join([Path.dirData, folder])
    
        try {
            if (!fs.existsSync(pathfiles)) return { error: `pasta não encontrada: '${folder}'` }
    
            files = fs.readdirSync(pathfiles, { withFileTypes: true })
                .filter(file => !file.isDirectory())
                .map(file => file.name)
        } catch (e) {
            console.log(e)
            return { error: `erro desconhecido` }
        }
        
        return { files }
    }
    
    getFileDetails(folder, file) {
        let details;
    
        const pathfile = Path.join([Path.dirData, folder, file])
    
        try{
            if (!fs.existsSync(pathfile)) return { error: `arquivo não encontrado: '${folder}/${file}'` }
    
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
    
        return { error: `erro desconhecido` }
    }

    getFilePath(folder, file) {
        return Path.join([Path.dirData, folder, file])
    }

    getFolderPath(folder) {
        return Path.join([Path.dirData, folder])
    }

    isValidName(name, file=false) {
        if (!name) return false
        if (file) return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_\. ]+$/)
    
        return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_ ]+$/)
    }

    isCorrectFile(folder, file) {
        if (!this.isValidName(folder)) return { error: `nome inválido: '${folder}'` }
        if (!this.isValidName(file, true)) return { error: `nome inválido: '${file}'` }

        const pathfolder = Path.join([Path.dirData, folder])

        if (!fs.existsSync(pathfolder)) return { error: `pasta não encontrada: '${folder}'` }

        const pathfile = Path.join([Path.dirData, folder, file])

        if (fs.existsSync(pathfile)) return { exist: true }

        return { ok: true }
    }

    deleteFile(folder, file) {
        if (!this.isValidName(folder)) return { error: `nome inválido: '${folder}'` }
        if (!this.isValidName(file, true)) return { error: `nome inválido: '${file}'` }

        const pathfile = Path.join([Path.dirData, folder, file])

        if (!fs.existsSync(pathfile)) return { error: `arquivo não encontrado: '${folder}/${file}'` }

        try {
            fs.unlinkSync(pathfile)
        } catch (e) {
            return null
        }

        return { ok: true }
    }

    backupFile(folder, file) {
        if (!this.isValidName(folder)) return { error: `nome inválido: '${folder}'` }
        if (!this.isValidName(file, true)) return { error: `nome inválido: '${file}'` }

        const pathfile = Path.join([Path.dirData, folder, file])

        if (!fs.existsSync(pathfile)) return { error: `arquivo não encontrado: '${file}'` }

        const pathfileBkp = Path.join([Path.dirBackup, folder, file])

        try {
            if (!fs.existsSync(Path.dirBackup)) {
                fs.mkdirSync(Path.dirBackup, { recursive: true })
            }

            fs.copyFileSync(pathfile, pathfileBkp)
            fs.unlinkSync(pathfile)
        } catch (e) {
            return { error: `erro desconhecido` }
        }

        return { ok: true }
    }

    createFolder(folder) {
        if (!this.isValidName(folder)) return { error: `nome inválido: '${folder}'` }

        const pathfolder = Path.join([Path.dirData, folder])

        if (fs.existsSync(pathfolder)) return { error: `pasta já existe: '${folder}'` }

        try {
            fs.mkdirSync(pathfolder)
        } catch (e) {
            return { error: `erro desconhecido` }
        }

        return { ok: true }
    }
}

module.exports = new FileService()