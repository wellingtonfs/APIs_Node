const express = require('express')
const rota = express.Router()

rota.get('/', (req, res) => {
    res.render('home')
})

rota.get('/criar_pasta', (req, res) => {
    res.render('create_folder')
})

module.exports = rota