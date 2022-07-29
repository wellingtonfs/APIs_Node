import express from "express"

import { Home } from "../../controllers/fileController.js"
import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get(
    '/:code',
    trycatch(Home)
)


export default rota