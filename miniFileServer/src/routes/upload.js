const express = require('express')
const rota = express.Router()

const multer = require('multer')
const configMulter = require('../modules/multer')
const Path = require('../util/path')
const fs = require('fs')

const upload = multer(configMulter).single('file')

rota.get('/', (req, res) => {
    res.render('upload')
})

rota.get('/criar_pasta', (req, res) => {
    res.render('criarPasta')
})

rota.post('/file', (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message })


        return res.status(200).json({
            filename: req.body.name,
            folder: req.body.pasta,
            url: `/${req.body.pasta}/${req.body.name}`,
            url_download: `/get/${req.body.pasta}/${req.body.name}`
        })
    })
})

rota.post('/createdir', async (req, res) => {
    try {
        var { name } = req.body

        if (!name)
            return res.status(400).json({ error: 'nome não fornecido' })

        if (!name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9 ]+$/))
            return res.status(400).json({ error: 'nome inválido' })

        const pathToCreate = Path.join([Path.dirData, name])

        if (fs.existsSync(pathToCreate))
            return res.status(400).json({ error: 'nome já em uso' })

        fs.mkdirSync(pathToCreate, { recursive: true })

        return res.status(200).json({ folder: name })

    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: 'nome inválido' })
    }

})

module.exports = rota