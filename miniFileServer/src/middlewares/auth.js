import FileService from "../services/fileServices.js"

//middleware para adicionar algum grau de proteção, embora seja mínima, totalmente burlável
export default async function (req, res, next) {
    //verificar se alguma pasta está sendo acessada
    let folder = req.params.folder ? req.params.folder : req.body.folder
    folder = decodeURIComponent(folder)

    if (!folder) return next()
    if (req.session.folder == folder) return next()

    //verificar se a pasta possui proteção
    const passwd = await FileService.folderIsProtected(folder)
    if (passwd === null) return next()

    //recupera o password da requisição
    const password = req.body.password

    if (password == passwd) {
        req.session.folder = folder
        return next()
    }

    //caso não tenha acesso, retorna um erro
    res.status(401).json({ error: "permission denied" })
}