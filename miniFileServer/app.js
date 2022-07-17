import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from "express";
import morgan from "morgan";
import exphbs from "express-handlebars";

//API

import apiFiles from "./src/routes/api/files.js"
import apiServices from "./src/routes/api/services.js"
import apiYoutube from "./src/routes/api/youtube.js"

import MyRobot from "./src/services/robot.js"

//front

import frontHome from "./src/routes/front/home.js"
import frontViewer from "./src/routes/front/view.js"
import rotaYoutube from "./src/routes/front/youtube.js"

const app = express()

// Definições
const porta = 3005

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
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

// Rotas

//api

app.use('/api', apiFiles)
app.use('/api/services', apiServices)
app.use('/api/youtube', apiYoutube)

//front

app.use('/', frontHome)
app.use('/view', frontViewer)
app.use('/youtube', rotaYoutube)

let server = app.listen(process.env.PORTA, () => console.log("Servidor Iniciado! IP: http://localhost:" + process.env.PORTA))

async function clear() {
    server.close()
    await MyRobot.close()
}

process.on('uncaughtException', clear);
process.on('unhandledRejection', clear);
process.on('SIGINT', clear);
process.on('SIGTERM', clear);