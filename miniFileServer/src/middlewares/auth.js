import FileService from "../services/fileServices.js"

//middleware adicionar algum grau de proteção, embora seja mínima, totalmente burlável
export default async function (req, res, next) {
    if (req.method.toLowerCase() == 'get')
        return next()

    const folder = decodeURIComponent(req.body.folder)
    const passwd = await FileService.folderIsProtected(folder)

    if (passwd === null) return next()

    const pd = req.body.password

    if (pd == passwd) return next()

    res.status(401).json({ error: "permission denied" })
}