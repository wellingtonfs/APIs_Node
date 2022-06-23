const express = require('express')
const rota = express.Router()

rota.get('/', (req, res) => {
    res.json({ api: 'on' })
})

module.exports = rota