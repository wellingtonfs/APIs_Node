const express = require('express')
const rota = express.Router()

const multer = require('multer')
const configMulter = require('../modules/multer')
const authMiddleware = require('../middlewares/auth')

const Path = require('../util/path')
const objArq = require('../util/objectFile')
const User = require('../models/Usuario')
const fs = require('fs')

rota.use(authMiddleware)

const upload = multer(configMulter).single('file')

rota.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err)
            return res.status(400).json({ error: err.message })
        else if(!req.user)
            return res.status(400).json({ error: "No file provided" })

        //salvar no banco
        const myfile = new objArq(
            req.body.name,
            'f', //f: file, p: path, dir, pasta
            req.body.dir,
            (req.file.size / 1024).toFixed(2) //kbytes
        )

        req.user.files.push(myfile)
        
        await req.user.save()

        return res.status(200).json({
            path: Path.join([req.body.dir, req.body.name], { convertToPlatform: false })
        })
    })
})

rota.post('/createdir', async (req, res) => {
    try {
        var { dir, name } = req.body

        if (!dir) dir = ''

        if (!name)
            return res.status(400).json({ error: 'name not provided' })

        if (!Path.isCorrectDir(dir))
            return res.status(400).json({ error: 'dir invalid' })

        if (!Path.isCorrectName(name))
            return res.status(400).json({ error: 'name invalid' })

        const user = await User.findById(req.userId)

        if (!user)
            return res.status(404).json({ error: 'Files not found. Please contact the support team!' })

        if (typeof user.files.find(item => item.t == 'p' && item.p == dir) == 'undefined') {
            return res.status(404).json({ error : 'Dir directory provided, but not found! Recursive creation not supported' })
        }

        if (!fs.existsSync(Path.join([user.root, dir])))
            return res.status(400).json({ error: 'Dir directory provided, but not found! Please contact the support team' })

        const pathToCreate = Path.join([user.root, dir, name])

        if (fs.existsSync(pathToCreate)) {
            return res.status(400).json({ error: 'Directory already exists' })
        }

        fs.mkdirSync(pathToCreate, { recursive: true })

        //salvar no banco
        const myfolder = new objArq(
            name,
            'p', //f: file, p: path, dir, pasta
            dir
        )

        user.files.push(myfolder)

        await user.save()

        return res.status(200).json({ path: Path.join([dir, name], { convertToPlatform: false }) })

    } catch (e) {
        return res.status(400).json({ error: 'Dir or name invalid' })
    }

})

module.exports = rota