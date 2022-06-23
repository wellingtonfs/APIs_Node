const express = require("express")
const mongoose = require("mongoose")

const rotaHome = require("./src/routes/home")
const rotaUpload = require("./src/routes/upload")
const rotaDownload = require("./src/routes/download")
const rotaAuth = require("./src/routes/auth")

const app = express()

// Definições
const porta = 3006

app.use(express.static(__dirname + '/recursos'));
app.use(express.json())
app.use(function(err, req, res, next){
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) 
        return res.status(400).send({ error: 'Error parsing data' })
    next()
})
app.use(express.urlencoded({extended: true}))

// Banco de dados
mongoose.Promise = global.Promise

var connectMongo = () => {
    console.log("Conectando ao Banco de dados...")
    mongoose.connect("mongodb://127.0.0.1:27017/filemanager", {
        keepAlive: true,
        keepAliveInitialDelay: 300000
    }).then(() => {
        console.log("Conectado ao Banco de Dados!")
    }).catch((err) => {
        console.log("Não foi possivel se conectar ao banco de dados! Erro: " + err)
        setTimeout(() => connectMongo(), 5000)
    })
}

connectMongo()

// Rotas

app.use('/', rotaHome)
app.use('/push', rotaUpload)
app.use('/get', rotaDownload)
app.use('/auth', rotaAuth)

app.listen(porta, () => console.log("Servidor Iniciado! IP: http://localhost:" + porta))