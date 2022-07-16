const express = require('express')
const rota = express.Router()

const multer = require('multer')

const configMulter = require('../../modules/multer')
const FileService = require('../../services/fileServices')

const upload = multer(configMulter).single('file')

rota.get('/get/:folder/:filename', async (req, res) => {
    const folder = req.params.folder
    const filename = req.params.filename

    let data = FileService.getFileDetails(folder, filename)

    if ( data.error ) return res.status(404).json({ error: data.error })

    res.attachment()
    res.type("application/octet-stream");
    res.sendFile(
        FileService.getFilePath(folder, filename)
    )
})

rota.post('/create_folder', async (req, res) => {
    const folder = req.body.folder

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

module.exports = rota