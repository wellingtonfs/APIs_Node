const multer = require('multer')

const FileService = require('../services/fileServices')

module.exports = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            //console.log(req)
            var { folder, filename, replace } = req.body

            // tratar dados do cliente

            if (!folder)
                return cb(new Error(`pasta não informada`))
            else if (!FileService.isValidName(folder))
                return cb(new Error('o nome da pasta é inválido'))

            if (!filename || !FileService.isValidName(filename, true))
                filename = file.originalname.trim()

            replace = (replace && replace.toLowerCase() == 'true') ? true : false

            // verificar existencia do arquivo

            const vfile = FileService.isCorrectFile(folder, filename)

            if ( vfile.error )
                return cb(new Error(vfile.error));
            else if ( vfile.exist && !replace )
                return cb(new Error("o arquivo já existe. use 'replace = true' para substituir"));
            else if ( replace )
                FileService.backupFile(folder, filename)

            return cb(null, FileService.getFolderPath(folder))
        },
        filename: (req, file, cb) => {
            if (!FileService.isValidName(req.body.filename, true)) {
                req.body.filename = file.originalname.trim()
            }

            return cb(null, req.body.filename.trim())
        }
    })
}