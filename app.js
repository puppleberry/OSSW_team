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
    fs.readFile('./static/index.html', function(err, data){
        if(err){
            response.send('error occured')
        }else{
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

io.sockets.on('connection', function(socket) {

    socket.on('newUser', function(name) {
      console.log(name + ' is connected')
  
      socket.name = name
  
      io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    })

    socket.on('message', function(data) {
      data.name = socket.name
      
      console.log(data)
  
      socket.broadcast.emit('update', data);
    })
  
    socket.on('disconnect', function() {
      console.log(socket.name + 'has left')
  
      socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
  })

server.listen(8080, function(){
    console.log('Server is running...')
})