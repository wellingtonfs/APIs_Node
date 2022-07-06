const multer = require('multer')
const Path = require('../util/path')
const fs = require('fs')

function isValidName(name, file=false) {
    if (file) return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_\. ]+$/)

    return name.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_ ]+$/)
}

module.exports = {
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            var { pasta, replace } = req.body

            if (!pasta) pasta = ''

            replace = (replace && replace.toLowerCase() == 'true') ? true : false

            if (!isValidName(pasta))
                return cb(new Error('Pasta inválida ou inexistente'))

            pasta = Path.normDir(pasta)

            // const user = await User.findById(req.userId)

            // if (!user) return cb(new Error('Files not found. Please contact the support team'))

            req.body.pasta = pasta

            // if (typeof user.files.find(item => item.t == 'p' && item._cp == dir) == 'undefined') {
            //     return cb(new Error('Dir directory provided, but not found! Use /push/createdir to create new path'))
            // }

            // if (!replace) {
            //     if (typeof user.files.find(item => item.t == 'f' && item.p == dir && item.n == file.originalname) != 'undefined') {
            //         return cb(new Error('File already exists'))
            //     }
            // }

            const pathTo = Path.join([Path.dirData, pasta])
            
            if (!fs.existsSync(pathTo))
                return cb(new Error('Pasta não encontrada. Crie uma utilizando a rota "/criar_pasta"'))

            return cb(null, pathTo)
        },
        filename: (req, file, cb) => {
            if (!isValidName(req.body.name, true)) {
                req.body.name = file.originalname.trim()
            }

            return cb(null, req.body.name.trim())
        }
    })
}