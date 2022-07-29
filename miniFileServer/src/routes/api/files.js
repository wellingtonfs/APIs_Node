import express from "express"

import { listFiles, listFolders } from "../../controllers/fileController.js"
import AuthMiddleware from "../../middlewares/auth.js"
import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get(
    '/list',
    trycatch(AuthMiddleware),
    trycatch(listFolders)
)

rota.post(
    '/list',
    trycatch(AuthMiddleware),
    trycatch(listFiles)
)

export default rota