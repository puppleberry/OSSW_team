// getting express module
const express = require('express')

// getting socket.io module
const socket = require('socket.io')

// getting node.js standard module
const http = require('http')

const fs = require('fs')
const app = express() // construct express object
const server = http.createServer(app) // construct http server
const io = socket(server) // binding the server

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response){
    fs.readFile('./static/js/index.html', function(err, data){
        if(err){
            response.send('error occured')
        }else{
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

io.sockets.on('connection', function(socket){
    console.log('User connected');

    socket.on('send', function(data){
        console.log('Message: ', data.msg)
    })

    socket.on('disconnect', function(){
        console.log('Disconnection')
    })
})

server.listen(8080, function(){
    console.log('Server is running...')
})