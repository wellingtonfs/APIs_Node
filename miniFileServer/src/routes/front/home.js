import express from "express"

import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get('/', trycatch(async (req, res) => {
    res.render('home')
}))

rota.get('/requestpermission/:folder', trycatch(async (req, res) => {
    res.render('auth', { folder: decodeURIComponent(req.params.folder) })
}))

rota.get('/upload', trycatch(async (req, res) => {
    res.render('upload')
}))

rota.get('/criar_pasta', trycatch(async (req, res) => {
    res.render('create_folder')
}))

rota.post('/checkin', trycatch(async (req, res) => {
    res.sendStatus(200)
}))

export default rota