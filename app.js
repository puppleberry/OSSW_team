// getting express module
const express = require('express')

// getting socket.io module
const socket = require('socket.io')

// getting node.js standard module
const path = require('path')
const http = require('http')

const fs = require('fs')
const app = express() // construct express object
const server = http.createServer(app) // construct http server
const io = socket(server) // binding the server

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
app.use(express.static(path.join(__dirname, 'src')));

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

io.on('connection', function(socket) {

    socket.on('newUser', function(name){
        console.log(name + " connect");
        socket.name = name;
        io.emit('announce', name + " 가 접속했습니다.");
    });

    socket.on('chatting', function(data){
        console.log(data);
        const {name, msg} = data;
        socket.name = name;
        io.emit('chatting', data)
    });

    socket.on('disconnect', function(){
        console.log(socket.name + " disconnect");
        io.emit('announce', socket.name + " 가 퇴장했습니다.");
    })

});

server.listen(8080, function(){
    console.log('Server is running on 8080...');
});

//REF

// https://github.com/leegeunhyeok/node-chat
// https://velog.io/@reasonz/2022.05.22-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%B1%84%ED%8C%85-%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-2-%EB%82%98%EB%A8%B8%EC%A7%80-%EC%99%84%EC%84%B1%ED%95%98%EA%B8%B0
// https://www.youtube.com/watch?v=UoKoPP91Qx0&list=PLpJDjPqxGWGrSGPUBqWlsJlcLF_grNClK&index=6&t=1904s
