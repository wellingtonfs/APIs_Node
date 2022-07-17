import express from "express"
import ytdl from "ytdl-core";
import MyRobot from "../../services/robot.js"

const rota = express.Router()

rota.post("/search", async (req, res) => {
    try {
    const frase = req.body.frase

    let resp = await MyRobot.getResults(frase)

    if (resp === null) return res.status(500).json({ error: "Erro desconhecido" })

    res.status(200).json(resp)
    } catch (e) {
        console.log(e)
    }
})

rota.get("/get_name/:videoid", async (req, res) => {
    const videoId = req.params.videoid

    let resp = await MyRobot.getVideoName(videoId)

    if (resp === null) return res.status(404).json({ error: "Vídeo não encontrado" })

    res.status(200).json(resp)
})

rota.get("/convert/:title/:url", async (req, res) => {
    const link = `https://www.youtube.com/watch?v=${decodeURIComponent(req.params.url)}`
    const title = decodeURIComponent(req.params.title) + '.mp3'

    try {
        const audio = ytdl(link, { quality: 'highestaudio' })

        res.set("Content-Disposition", `filename=${title}`);
        res.contentType("audio/mpeg")
        audio.pipe(res)

    } catch (e) {
        res.status(400).json({ error: `link inválido: ${link}` })
    }
})

rota.get("/get/:url", async (req, res) => {
    const videoId = decodeURIComponent(req.params.url)
    const link = `https://www.youtube.com/watch?v=${videoId}`

    const videoname = await MyRobot.getVideoName(videoId)
    let title = "api_convert.mp3"

    if (videoname !== null) {
        title = videoname.name + '.mp3'
    }

    try {
        const audio = ytdl(link, { quality: 'highestaudio' })

        res.contentType("audio/mpeg")
        res.attachment(title)
        //res.set("Content-Transfer-Encoding", "binary")
        audio.pipe(res)

    } catch (e) {
        res.status(400).json({ error: `link inválido: ${link}` })
    }
})

export default rota