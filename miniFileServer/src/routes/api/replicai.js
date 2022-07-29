import express from "express"
import { helpMakepose, makepose } from "../../controllers/replicaiController.js"
import trycatch from "../../util/trycatch.js"

const rota = express.Router()

rota.get('/makepose', trycatch(helpMakepose))

rota.post('/makepose', trycatch(makepose))

/*

{
    linewidth: 15,
    keypoints: {...}
}

{
    keypoints: [
        pose1: {
            linewidth: 5,
            data: {...}
        },
        pose2: {
            linewidth: 5,
            data: {...}
        }
    ]
}

*/

export default rota