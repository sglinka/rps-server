const express = require('express')
const app = express()
const ws = require('ws')
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:8080'
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const wsServer = new ws.Server({ noServer: true });

app.use((req, res, next) => {
    res.wss = wsServer
    next()
})

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Rock-Paper-Scissors API'
    })
})

const http = require('http').createServer(app)

const PORT = process.env.PORT || 8081

wsServer.on('connection', socket => {
    socket.on('message', message => console.log(message));
})

const server = http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})
