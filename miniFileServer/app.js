const express = require("express")
const morgan = require('morgan')
const exphbs  = require('express-handlebars');

const rotaHome = require("./src/routes/home")
const rotaUpload = require("./src/routes/push")
const rotaDownload = require("./src/routes/get")
const rotaFolder = require("./src/routes/folder")
const rotaViewer = require("./src/routes/view")

const app = express()

// Definições
const porta = 3006

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan('dev'))

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.static(__dirname + '/recursos'));
app.use(express.json())
app.use(function(err, req, res, next){
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) 
        return res.status(400).send({ error: 'Error parsing data' })
    next()
})
app.use(express.urlencoded({extended: true}))

// Rotas

app.use('/', rotaHome)
app.use('/push', rotaUpload)
app.use('/get', rotaDownload)
app.use('/folder', rotaFolder)
app.use('/view', rotaViewer)

let server = app.listen(porta, () => console.log("Servidor Iniciado! IP: http://localhost:" + porta))

process.on('uncaughtException', () => server.close());
process.on('unhandledRejection', () => server.close());
process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());