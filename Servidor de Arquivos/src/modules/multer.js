const multer = require('multer')
const Path = require('../util/path')
const fs = require('fs')

const User = require('../models/Usuario')

module.exports = {
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            var { dir, replace } = req.body

            if (!dir)
                dir = ''

            replace = (replace && replace.toLowerCase() == 'true') ? true : false

            if (!Path.isCorrectDir(dir))
                return cb(new Error('dir invalid. Use: path/to/file'))

            dir = Path.normDir(dir)

            const user = await User.findById(req.userId)

            if (!user) return cb(new Error('Files not found. Please contact the support team'))

            req.user = user
            req.body.dir = dir

            if (typeof user.files.find(item => item.t == 'p' && item._cp == dir) == 'undefined') {
                return cb(new Error('Dir directory provided, but not found! Use /push/createdir to create new path'))
            }

            if (!replace) {
                if (typeof user.files.find(item => item.t == 'f' && item.p == dir && item.n == file.originalname) != 'undefined') {
                    return cb(new Error('File already exists'))
                }
            }

            const pathTo = Path.join([user.root, dir])
            
            if (!fs.existsSync(pathTo))
                return cb(new Error('Dir not found. Please contact the support team'))

            return cb(null, pathTo)
        },
        filename: (req, file, cb) => {
            req.body.name = file.originalname

            return cb(null, file.originalname)
        }
    })
}