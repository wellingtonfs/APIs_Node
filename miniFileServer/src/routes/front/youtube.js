import express from "express"

const rota = express.Router()

rota.get('/', async (req, res) => {
    let params = req.query

    if (typeof params.bot != 'undefined')
        return res.render('youtube', { rota: "/api/youtube-robot" })

    res.render('youtube', { rota: "/api/youtube" })
})

rota.get('/:videoid', async (req, res) => {
    const videoId = decodeURIComponent(req.params.videoid)
    let params = req.query

    if (typeof params.bot != 'undefined')
        return res.render('youtube', { videoId, rota: "/api/youtube-robot" })

    res.render('youtube', { videoId, rota: "/api/youtube" })
})

export default rota