import express from "express"
import ytdl from "ytdl-core";

import ApiYoutube from "../../services/api_youtube.js";
import UrlParser from "../../services/urlparseServices.js"

const rota = express.Router()

rota.post("/search", async (req, res) => {
    const frase = req.body.frase

    let resp = await ApiYoutube.getResults(frase)

    if (resp === null) return res.status(500).json({ error: "Erro desconhecido" })

    res.status(200).json(resp)
})

rota.get("/get_name/:videoid", async (req, res) => {
    const videoId = req.params.videoid

    let resp = await ApiYoutube.getVideoName(videoId)

    if (resp === null) return res.status(404).json({ error: "Vídeo não encontrado" })

    res.status(200).json(resp)
})

rota.get("/get_link/:videoid", async (req, res) => {
    const videoId = req.params.videoid

    let resp = await ApiYoutube.getVideoName(videoId)

    if (resp === null) return res.status(404).json({ error: "Vídeo não encontrado" })

    //let url = `${UrlParser.CONSTS.URL_YOUTUBE_DOWNLOAD}/${videoId}`

    //await UrlParser.saveVideoId(videoId, url)

    res.status(200).json({
        url: `${UrlParser.CONSTS.URL_ENCURTADOR}/${videoId}`
    })
})

rota.get("/convert/:videoid", async (req, res) => {
    const videoId = decodeURIComponent(req.params.videoid)
    const link = `https://www.youtube.com/watch?v=${videoId}`

    const videoname = await ApiYoutube.getVideoName(videoId)
    let title = "api_convert.mp3"

    if (videoname !== null) {
        title = videoname.name + '.mp3'
    }

    try {
        const audio = ytdl(link, { quality: 'highestaudio' })

        res.set("Content-Disposition", `filename=${title}`);
        res.contentType("audio/mpeg")
        audio.pipe(res)

    } catch (e) {
        res.status(400).json({ error: `link inválido: ${link}` })
    }
})

rota.get("/get/:videoid", async (req, res) => {
    const videoId = decodeURIComponent(req.params.videoid)
    const link = `https://www.youtube.com/watch?v=${videoId}`

    const videoname = await ApiYoutube.getVideoName(videoId)
    let title = "api_convert.mp3"

    if (videoname !== null) {
        title = videoname.name + '.mp3'
    }

    try {
        const audio = ytdl(link, { quality: 'highestaudio' })

        res.contentType("audio/mpeg")
        res.attachment(title)
        audio.pipe(res)

    } catch (e) {
        res.status(400).json({ error: `link inválido: ${link}` })
    }
})

export default rota