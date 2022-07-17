import express from "express"

const rota = express.Router()

rota.get('/', async (req, res) => {
    res.render('youtube')
})

export default rota