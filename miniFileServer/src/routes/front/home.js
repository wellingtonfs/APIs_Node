import express from "express"

import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get('/', trycatch((req, res) => {
    res.render('home')
}))

rota.get('/upload', trycatch((req, res) => {
    res.render('upload')
}))

rota.get('/criar_pasta', trycatch((req, res) => {
    res.render('create_folder')
}))

rota.post('/checkin', trycatch((req, res) => {
    res.sendStatus(200)
}))

export default rota