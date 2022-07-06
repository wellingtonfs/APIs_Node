const express = require('express')
const rota = express.Router()
const fs = require('fs')

const Path = require('../util/path')

rota.get('/list', async (req, res) => {
    let folders = []

    try {
        if (!fs.existsSync(Path.dirData)) return res.status(200).json({ folders })

        folders = fs.readdirSync(Path.dirData, { withFileTypes: true })
            .filter(file => file.isDirectory())
            .map(file => file.name)
    } catch (e) {
        console.log(e)
    }
    
    return res.status(200).json({ folders })
})

rota.post('/create', async (req, res) => {
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