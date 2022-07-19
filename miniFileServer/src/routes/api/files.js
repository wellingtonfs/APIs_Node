import express from "express"

import FileService from "../../services/fileServices.js"
import UrlParser from "../../services/urlparseServices.js"

const rota = express.Router()

rota.get('/list', async (req, res) => {
    const data = FileService.listFolders()

    if ( data.error ) return res.status(500).json({ error: "erro desconhecido" })

    return res.status(200).json(data)
})

rota.post('/list', async (req, res) => {
    let { folder, file } = req.body

    if ( !folder ) return res.status(400).json({ error: "argumento necessário: 'folder', argumento opcional: 'file'" })

    let data;

    if ( file ) {
        data = FileService.getFileDetails(folder, file)

        if ( data.error ) return res.status(404).json({ error: data.error })

        //Buscar ou criar ID do link

        let url = UrlParser.getUrlForDownload(folder, file)
        let code = await UrlParser.getIdByUrl(url, { createIfNotExist: true })

        return res.status(200).json({
            ...data,
            url: `${UrlParser.CONSTS.URL_ENCURTADOR}/${code}`
        })
    }

    data = FileService.listFiles(folder)

    if ( data.error ) return res.status(404).json({ error: data.error })

    return res.status(200).json(data)
})

export default rota