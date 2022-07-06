const express = require('express')
const rota = express.Router()

const multer = require('multer')
const configMulter = require('../modules/multer')

const opFs = require('../util/folder')

const upload = multer(configMulter).single('file')

rota.get('/', (req, res) => {
    res.render('push', { folders: JSON.stringify(opFs.listdirs()) })
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

rota.get('/criar_pasta', (req, res) => {
    res.render('push_create_folder')
})

module.exports = rota