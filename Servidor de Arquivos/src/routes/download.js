const express = require('express')
const rota = express.Router()
const fs = require('fs')

const authMiddleware = require('../middlewares/auth')
const User = require('../models/Usuario')
const Path = require('../util/path')

rota.use(authMiddleware)

rota.get('/', async (req, res) => {
    var { dir, filename } = req.body

    if (!filename)
        return res.status(400).json({ error: 'No filename provided' })

    if (!dir)
        dir = ''

    if (!Path.isCorrectDir(dir))
        return res.status(400).json({ error: 'dir invalid. Use: path/to/file (only path)' })

    const user = await User.findById(req.userId)

    if (!user)
        return res.status(400).json({ error: 'Token Invalid. Please generate a new one' })

    if (typeof user.files.find(item => item.t == 'f' && item.n == filename && item.p == dir) == 'undefined') {
        return res.status(404).json({ error: 'File not found' })
    }

    const pathfile = Path.join([user.root, dir, filename])

    if (fs.existsSync(pathfile)) {
        return res.sendFile(pathfile)
    } else {
        return res.status(404).json({ error: 'File not found' })
    }
})

rota.get('/listdir', async (req, res) => {
    var { dir } = req.body
    
    if (!dir)
        dir = ''

    if (!Path.isCorrectDir(dir))
        return res.status(400).json({ error: 'dir invalid. Use: path/to/file (only path)' })

    const user = await User.findById(req.userId)

    if (!user)
        return res.status(400).json({ error: 'Token Invalid. Please generate a new one' })

    if (typeof user.files.find(item => item.t == 'p' && item.p == dir) == 'undefined') {
        return res.status(404).json({ error: 'Dir not found' })
    }

    const files = user.files
                    .filter(item => item.p == dir && item._m)
                    .map(item => {
                        let resp = {}

                        for (let key in item) {
                            if (key.startsWith('_')) continue;
                            resp[key] = item[key]
                        }

                        return resp
                    })

    return res.status(200).json({ files })
})

module.exports = rota