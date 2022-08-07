import MakePose from "../bolsa/posemaker.js"

export async function helpMakepose(req, res) {
    res.status(200).json({
        formatoAceito: {
            linewidth: "Espessura da linha da pose. É esperado um inteiro positivo",
            keypoints: "A pose em formato JSON gerada pelo openpose"
        }
    })
}

export async function makepose(req, res) {
    const linewidth = req.body.linewidth
    const keypoints = req.body.keypoints

    if (!linewidth || !keypoints)
        return res.status(400).json({ error: "campos obrigatórios: linewidth, keypoints" })

    const dataStream = await MakePose({
        linewidth: linewidth,
        data: keypoints
    })

    if (dataStream === null)
        return res.sendStatus(400)

    res.status(200)
    dataStream.pipe(res)
}