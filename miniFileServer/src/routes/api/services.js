const express = require('express')
const rota = express.Router()

const multer = require('multer')

const configMulter = require('../../modules/multer')

const upload = multer(configMulter).single('file')

rota.post('/get', async (req, res) => {
    res.status(200).json({ rota: 'download' })
})

//folder, filename, replace
rota.post('/push', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message })

        return res.sendStatus(200)
    })
})

module.exports = rota