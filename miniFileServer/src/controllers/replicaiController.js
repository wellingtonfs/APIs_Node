import MakePose from "../bolsa/posemaker.js"

export async function helpMakepose(req, res) {
    res.status(200).json({
        formatoAceito: {
            linewidth: "Espessura da linha da pose. É esperado um inteiro positivo",
            width: "Largura da imagem de saída. É esperado um inteiro positivo",
            height: "Altura da imagem de saída. É esperado um inteiro positivo",
            keypoints: "A pose em formato JSON gerada pelo openpose"
        }
    })
}

export async function makepose(req, res) {
    const linewidth = req.body.linewidth
    const width = req.body.width
    const height = req.body.height
    const keypoints = req.body.keypoints

    if (!linewidth || !keypoints || !width || !height)
        return res.status(400).json({ error: "campos obrigatórios: linewidth, width, height, keypoints" })
    
    if (width < 4 || height < 4)
        return res.status(400).json({ error: "largura e altura mínima: 4" })

    const dataStream = await MakePose({
        linewidth: linewidth,
        width,
        height,
        data: keypoints
    })

    if (dataStream === null)
        return res.sendStatus(400)

    res.status(200)
    dataStream.pipe(res)
}