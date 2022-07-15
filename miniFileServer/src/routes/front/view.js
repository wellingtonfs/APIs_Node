const express = require('express')
const rota = express.Router()

rota.get('/', async (req, res) => {
    res.render('view')
})

rota.get('/:dir', async (req, res) => {
    const folder = decodeURIComponent(req.params.dir)

    res.render('view_folder', { folder: folder })
})

rota.get('/:dir/:file', async (req, res) => {
    const folder = decodeURIComponent(req.params.dir)
    const file = decodeURIComponent(req.params.file)

    res.render('view_file', { folder: folder, file: file })
})


// rota.get('/:dir', async (req, res) => {
//     const dir = req.params.dir

//     res.render('view_folder', { folder: dir, files: JSON.stringify(opFs.listfiles(dir)) })
// })

// rota.get('/:dir/:filename', async (req, res) => {
//     const dir = req.params.dir
//     const filename = req.params.filename

//     return res.status(200).json({ details: opFs.getFileDetails(dir, filename) })

//     if (!filename)
//         return res.status(400).json({ error: 'No filename provided' })

//     if (!dir)
//         dir = ''

//     if (!Path.isCorrectDir(dir))
//         return res.status(400).json({ error: 'dir invalid. Use: path/to/file (only path)' })

//     const user = await User.findById(req.userId)

//     if (!user)
//         return res.status(400).json({ error: 'Token Invalid. Please generate a new one' })

//     if (typeof user.files.find(item => item.t == 'f' && item.n == filename && item.p == dir) == 'undefined') {
//         return res.status(404).json({ error: 'File not found' })
//     }

//     const pathfile = Path.join([user.root, dir, filename])

//     if (fs.existsSync(pathfile)) {
//         return res.sendFile(pathfile)
//     } else {
//         return res.status(404).json({ error: 'File not found' })
//     }
// })

module.exports = rota