import express from "express"
import multer from "multer"
import fs from "fs"

import configMulter from "../../modules/multer.js"
import FileService from "../../services/fileServices.js"

const rota = express.Router()
const upload = multer(configMulter).single('file')

rota.get('/get/:folder/:filename', async (req, res) => {
    const folder = decodeURIComponent(req.params.folder)
    const filename = decodeURIComponent(req.params.filename)

    let data = FileService.getFileDetails(folder, filename)

    if ( data.error ) return res.status(404).json({ error: data.error })

    const stream = fs.createReadStream(FileService.getFilePath(folder, filename))

    res.attachment(filename)
    stream.pipe(res)
})

rota.get('/view/:folder/:filename', async (req, res) => {
    const folder = decodeURIComponent(req.params.folder)
    const filename = decodeURIComponent(req.params.filename)

    let data = FileService.getFileDetails(folder, filename)

    if ( data.error ) return res.status(404).json({ error: data.error })

    res.sendFile(
        FileService.getFilePath(folder, filename)
    )
})

rota.post('/create_folder', async (req, res) => {
    const folder = decodeURIComponent(req.body.folder)

    const data = FileService.createFolder(folder)

    if (data.error) return res.status(400).json({ error: data.error })

    res.sendStatus(200)
})

//folder, filename, replace
rota.post('/push', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message })

        return res.status(200).json({
            folder: req.body.folder,
            filename: req.body.filename
        })
    })
})

export default rota