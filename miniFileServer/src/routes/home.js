const express = require('express')
const rota = express.Router()

rota.get('/', (req, res) => {
    res.render('home')
})

module.exports = rota