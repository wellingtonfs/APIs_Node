const express = require('express')
const rota = express.Router()

const FileService = require('../../services/fileServices')

rota.get('/list', async (req, res) => {
    const data = FileService.listFolders()

    if ( data.error ) return res.status(500).json({ error: "erro desconhecido" })

    return res.status(200).json(data)
})

rota.post('/list', async (req, res) => {
    const { folder, file } = req.body

    if ( !folder ) return res.status(400).json({ error: "argumento necessário: 'folder', argumento opcional: 'file'" })

    let data;

    if ( file ) {
        data = FileService.getFileDetails(folder, file)

        if ( data.error ) return res.status(404).json({ error: data.error })

        return res.status(200).json(data)
    }

    data = FileService.listFiles(folder)

    if ( data.error ) return res.status(404).json({ error: data.error })

    return res.status(200).json(data)
})

module.exports = rota