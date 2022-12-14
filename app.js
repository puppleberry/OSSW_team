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
/*

REF List

- SERVER PART: https://github.com/leegeunhyeok/node-chat
    * node.js 문법 학습
    * 기본 기능 코드 토대
    + 채팅과 별도로 공지글 Li append 기능 추가 
    + key 입력 추가 

- FRONt PART: https://velog.io/@reasonz/2022.05.22-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%B1%84%ED%8C%85-%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-2-%EB%82%98%EB%A8%B8%EC%A7%80-%EC%99%84%EC%84%B1%ED%95%98%EA%B8%B0
    * 웹 템플릿
    * 기본 웹 토대
    + 공지글 class css 코드 추가
    + 공지글 class html 코드 추가
    - 프로필 이미지 삭제
    - 타임스탬프 삭제

License
    - node.js: MIT License (라이선스 명시)
    - socket.io: MIT License (라이선스 명시)
    - express.js: MIT License (라이선스 명시)

    - 참고한 블로그 모두 라이선스를 명시해 두지 않고 있음.
*/
