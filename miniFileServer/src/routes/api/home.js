import express from "express"

import UrlParser from "../../services/urlparseServices.js"

const rota = express.Router()

rota.get('/:code', async (req, res) => {
    const code = decodeURIComponent(req.params.code)

    const urlparse = await UrlParser.getUrlById(code)

    if (urlparse === null) {
        if (code.length > UrlParser.CONSTS.CODE_SIZE) {
            return res.redirect(`${UrlParser.CONSTS.URL_YOUTUBE_DOWNLOAD}/${code}`)
        }

        return res.status(404).json({ error: "página não encontrada" })
    }

    res.redirect(urlparse)
})


export default rota