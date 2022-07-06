import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.send("Hello, its works!")
})

const server = app.listen(process.env.PORT)

process.on('uncaughtException', () => server.close())
process.on('unhandledRejection', () => server.close())
process.on('SIGINT', () => server.close())
process.on('SIGTERM', () => server.close())