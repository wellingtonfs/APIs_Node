import multer from "multer"
import fs from "fs"

import FileService from "../services/fileServices.js"
import UrlParser from "../services/urlparseServices.js"
import configMulter from "../modules/multer.js"

const upload = multer(configMulter).single('file')

export async function Home(req, res) {
    const code = decodeURIComponent(req.params.code)

    const urlparse = await UrlParser.getUrlById(code)

    if (urlparse === null) {
        if (code.length > UrlParser.CONSTS.CODE_SIZE) {
            return res.redirect(`${UrlParser.CONSTS.URL_YOUTUBE_DOWNLOAD}/${code}`)
        }

        return res.status(404).json({ error: "página não encontrada" })
    }

    res.redirect(urlparse)
}

export async function listFolders(req, res) {
    const data = FileService.listFolders()

    if ( data.error ) return res.status(500).json({ error: "erro desconhecido" })

    return res.status(200).json(data)
}

export async function listFiles(req, res) {
    let { folder, file } = req.body

    folder = folder ? decodeURIComponent(folder) : false
    file = file ? decodeURIComponent(file) : false

    if ( !folder ) return res.status(400).json({ error: "argumento necessário: 'folder', argumento opcional: 'file'" })

    let data;

    if ( file ) {
        data = FileService.getFileDetails(folder, file)

        if ( data.error ) return res.status(404).json({ error: data.error })

        //Buscar ou criar ID do link

        let url = UrlParser.getUrlForDownload(folder, file)
        //let code = await UrlParser.getIdByUrl(url, { createIfNotExist: true })

        return res.status(200).json({
            ...data,
            url
        })
    }

    data = FileService.listFiles(folder)

    if ( data.error ) return res.status(404).json({ error: data.error })

    return res.status(200).json(data)
}

export async function downloadFile(req, res) {
    const folder = decodeURIComponent(req.params.folder)
    const filename = decodeURIComponent(req.params.filename)

    let data = FileService.getFileDetails(folder, filename)

    if ( data.error ) return res.status(404).json({ error: data.error })

    const stream = fs.createReadStream(FileService.getFilePath(folder, filename))

    res.attachment(filename)
    stream.pipe(res)
}

export async function viewFile(req, res) {
    const folder = decodeURIComponent(req.params.folder)
    const filename = decodeURIComponent(req.params.filename)

    let data = FileService.getFileDetails(folder, filename)

    if ( data.error ) return res.status(404).json({ error: data.error })

    res.sendFile(
        FileService.getFilePath(folder, filename)
    )
}

export async function createFolder(req, res) {
    const folder = decodeURIComponent(req.body.folder)

    const data = FileService.createFolder(folder)

    if (data.error) return res.status(400).json({ error: data.error })

    res.sendStatus(200)
}

//folder, filename, replace
export async function uploadFile(req, res) {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message })

        return res.status(200).json({
            folder: req.body.folder,
            filename: req.body.filename
        })
    })
}