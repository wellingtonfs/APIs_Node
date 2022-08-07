import express from "express"

import { downloadFile, viewFile, createFolder, uploadFile } from "../../controllers/fileController.js"
import AuthMiddleware from "../../middlewares/auth.js"
import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get('/get/:folder/:filename',
    trycatch(AuthMiddleware),
    trycatch(downloadFile)
)

rota.get('/view/:folder/:filename',
    trycatch(AuthMiddleware),
    trycatch(viewFile)
)

rota.post('/create_folder',
    trycatch(createFolder)
)

rota.post('/push/:folder',
    trycatch(AuthMiddleware),
    trycatch(uploadFile)
)

export default rota