import express from "express"

const rota = express.Router()

rota.get('/', async (req, res) => {
    res.render('view')
})

rota.get('/:dir', async (req, res) => {
    const folder = decodeURIComponent(req.params.dir)

    res.render('view_folder', { folder: folder })
})

rota.get('/:dir/:filename', async (req, res) => {
    const folder = decodeURIComponent(req.params.dir)
    const filename = decodeURIComponent(req.params.filename)

    res.render('view_file', { folder: folder, file: filename })
})

export default rota