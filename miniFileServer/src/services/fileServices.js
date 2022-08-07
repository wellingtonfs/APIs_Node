import Path from "../util/path.js"
import fs from "fs"

import Folder from "../models/Folder.js"

class FileService {
    constructor () {
        if (!fs.existsSync(Path.dirData))
            fs.mkdirSync(Path.dirData)
        if (!fs.existsSync(Path.dirBackup))
            fs.mkdirSync(Path.dirBackup)

        this.maxNameLength = 90
    }

    async folderIsProtected(folder) {
        const res = await Folder.findOne({ name: folder })

        if (!res) return null
        return res.passwd
    }

    async setFolderProtection(folder, passwd) {
        const res = await Folder.findOne({ name: folder })

        if (res) return null

        await Folder.create({
            name: folder,
            passwd
        })
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
                folder: folder,
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
        if (name.length > this.maxNameLength) return false
        if (file) return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_\.\(\) ]+$/)
    
        return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_\(\) ]+$/)
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
        return new Promise((res) => {
            if (!this.isValidName(folder)) res({ error: `nome inválido: '${folder}'` })
            if (!this.isValidName(file, true)) res({ error: `nome inválido: '${file}'` })

            const pathfile = Path.join([Path.dirData, folder, file])

            if (!fs.existsSync(pathfile)) res({ error: `arquivo não encontrado: '${file}'` })

            const dest = Path.join([Path.dirBackup, folder])
            const pathfileBkp = Path.join([dest, file])

            try {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true })
                }

                fs.copyFile(pathfile, pathfileBkp, (err) => {
                    res({ ok: true })
                })
            } catch (e) {
                console.log(e)
                res({ error: `erro desconhecido` })
            }

            res({ ok: true })
        })
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

export default new FileService()