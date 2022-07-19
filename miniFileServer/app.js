import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from "express";
import morgan from "morgan";
import exphbs from "express-handlebars";
import mongoose from "mongoose";

// import https from "https";
// import fs from "fs";

// const key = fs.readFileSync(__dirname + '/certificados/selfsigned.key');
// const cert = fs.readFileSync(__dirname + '/certificados/selfsigned.crt');

// const options = {
//     key: key,
//     cert: cert
// };

// import getShortUrl from "./src/services/robotEncurtador.js";

// (async function () {
//     console.log(await getShortUrl("https://179.189.133.252:3005/api/b2fea38"))
// })()

//API

import apiHome from "./src/routes/api/home.js"
import apiFiles from "./src/routes/api/files.js"
import apiServices from "./src/routes/api/services.js"
import apiYoutube from "./src/routes/api/youtube.js"

//front

import frontHome from "./src/routes/front/home.js"
import frontViewer from "./src/routes/front/view.js"
import rotaYoutube from "./src/routes/front/youtube.js"

const app = express()

// Definições

app.use(morgan('dev'))

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/src/views');

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
    console.log("Tentando conectar ao banco de dados...")
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}@api-youtube.nlanral.mongodb.net/?retryWrites=true&w=majority`, {
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

//api

app.use('/api', apiHome)
app.use('/api/files', apiFiles)
app.use('/api/services', apiServices)
app.use('/api/youtube', apiYoutube)

//front

app.use('/', frontHome)
app.use('/view', frontViewer)
app.use('/youtube', rotaYoutube)

let server = app.listen(process.env.PORTA, () => console.log("Servidor Iniciado! IP: http://localhost:" + process.env.PORTA))

async function clear() {
    server.close()
}

process.on('uncaughtException', clear);
process.on('unhandledRejection', clear);
process.on('SIGINT', clear);
process.on('SIGTERM', clear);