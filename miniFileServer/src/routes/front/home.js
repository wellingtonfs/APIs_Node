import express from "express"

const rota = express.Router()

rota.get('/', (req, res) => {
    res.render('home')
})

rota.get('/upload', (req, res) => {
    res.render('upload')
})

rota.get('/criar_pasta', (req, res) => {
    res.render('create_folder')
})

rota.post('/checkin', (req, res) => {
    res.sendStatus(200)
})

export default rota