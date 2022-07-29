import express from "express"

import { downloadFile, viewFile, createFolder, uploadFile } from "../../controllers/fileController.js"
import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get('/get/:folder/:filename', trycatch(downloadFile))

rota.get('/view/:folder/:filename', trycatch(viewFile))

rota.post('/create_folder', trycatch(createFolder))

rota.post('/push', trycatch(uploadFile))

export default rota