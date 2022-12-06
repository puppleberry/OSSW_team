# OSSW_TeamProject
* * *
## 1. 프로젝트 소개
### 1.1. 무슨 프로젝트인가?
> 웹을 통해서 서버에 접속하여 해당 웹에 접속한 사람끼리 익명으로 대화를 나눌 수 있는 시스템.
### 1.2. 프로젝트 사용 예시
> USERS
> > - 웹 사이트 접속
> > - 사용자명 입력 (입력하지 않을 시 임의의 익명 닉네임으로 설정 됨)
> > - 채팅 텍스트 칸에 텍스트 입력 후, 전송 버튼을 누르면 클라이언트의 메세지 전송

> SERVER
> > - 임의의 클라이언트 A 접속시 A에게 이름을 받아와 웹에 접속한 모든 클라이언트에게 입장 메세지 표시
> > - 임의의 클라이언트 A가 메세지 전송 시 모든 클라이언트에게 해당 메세지와 해당 클라이언트의 이름 표시
> > - 임의의 클라이언트 A 퇴장시 웹에 접속한 모든 클라이언트에게 퇴장 메세지 표시
### 1.3. 프로젝트 역할 분배
> 송진우
>> - 백엔드 서버 구축
>> - 프론트엔드 코드 일부 수정   
>> - 보고서, 회의록 

> 김동욱
>> - 프론트 HTML 템플릿 검색 후 업로드
>> - HTML 템플릿에서 필요없는 부분 제거 및 약간의 수정   
>> - 발표 자료 프리젠테이션 제작

> 정민우
>> - HTML 템플릿에 필요한 코드를 추가 및 수정
>> - CSS 일부 수정   
>> - 발표 자료 프리젠테이션 제작

### 1.4. 사용한 기술 스택
> BACK
> > - node.js - [github](https://github.com/nodejs/node/LICENSE) (MIT Lincense)
> > - socket.io - [github](https://github.com/socketio/socket.io/LICENSE) (MIT License)

> FRONT
> > - HTML
> > - CSS
> > - javascript

### 1.5. 라이선스
    node.js 와 socket.io의 라이선스와 동일한 MIT License 적용
* * *
## 2. 프로젝트 깃허브 사용 용도
### 2.1. git add / commit / push
```
일반적으로 업데이트 한 코드를 깃허브 원격저장소에 업로드 하기위해서 해당 명령어를 사용하여 업로드함.
```
### 2.2. fork, branch, PR, merge
```
프로젝트에 참가하는 인원 모두 해당 프로젝트를 fork해서 본인 저장소에 둔 후, branch로 자신의 몇번째 패치인지 구분,
패치 한 이후에 PR을 보내서 merge해주는 식으로 협업을 진행함.
```
### 2.3. release
```
깃허브의 장점인 버전 관리를 사용자들도 느낄 수 있도록 하기 위해서 큰 기능이 업데이트 될 때 마다 버전을 구분하여 release 시킴
pre-release, lateset-release 사용은 코드가 단순하여 심각한 오류가 발생할 일이 없고, 사용하는 유저가 한정되어있으니,
stable version, latese version같은것을 구분할 필요가 없다고 생각했기 때문.
```
### 2.4. issue
```
코드의 문제를 발견하는데, 팀 프로젝트를 같이 하는 팀원들끼리의 메신저를 사용하여 오류를 찾아내고 수정해도 좋았겠지만,
깃허브의 issue를 사용하게 되면,
해당 issue가 발생한다는 사실, 어떻게 혹은 언제 고쳐졌나 하는 사실, 그리고 여러 기능을 첨가하여 한눈에 볼 수 있다는 점
이런 이유들 때문에 github의 issue 기능을 팀 프로젝트에 사용하게 되었다.
```
* * *
## 3. CODE explain, CODE documentation

### 3.1 app.js
#### 3.1.1 constant setting part
```javascript
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
```
써야 할 모듈을 불러오고, http 서버를 생성하고 서버를 소켓에 바인딩 하는 과정

#### 3.1.2 event listen part
```javascript
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
```
이벤트를 세가지로 나누어서 구분함
- 'newUser'
  - 클라이언트가 접속하였을 때 오는 이벤트
- 'chatting'
  - 클라이언트가 채팅할 때 오는 이벤트
- 'disconnect'
  - 클라이언트가 접속을 끊었을 때 오는 이벤트
  
### 3.2. index.js
#### 3.2.1 constant setting
```javascript
const socket = io();
const nickname = document.querySelector('#nickname');
const chatList = document.querySelector('.chatting-list');
const chatInput = document.querySelector('.chatting-input');
const sendButton = document.querySelector('.send-button');
const displayContainer = document.querySelector('.display-container');
```
html의 쿼리를 담아서, 해당 쿼리를 사용할 수 있도록 상수로 선언해주는 과정
#### 3.2.2 event listening
```javascript
socket.on('connect',function(){
    var name = prompt('환영합니다! 당신을 뭐라고 소개하나요: ', '');
    if(!name){
      name = '익명의 누군가'+ Math.floor(Math.random()*100);
    }
    nickname.defaultValue = name;
    socket.emit('newUser', name);
});

socket.on('chatting', function(data){
  const { name, msg } = data;
  const item = new Li(name, msg);
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

socket.on('announce', function(msg){
  const item = new announement(msg);
  item.makeAn();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});
```
- 'connect'
    - 기본으로 설정되어있는 이벤트, 클라이언트가 접속하면 자동 실행 됨, 이름을 설정해주고 그 뒤에 서버로 넘겨서 newUser 이벤트 실행시킴.
- 'chatting'
    - 채팅 이벤트, HTML 코드의 채팅부분 `<li>` 쿼리에 일부 코드를 삽입하여서(채팅) 점점 채팅을 만들어 내주는 이벤트.
- 'announce'
    - 공지 이벤트, HTML 코드의 채팅부분 `<li>` 쿼리에 일부 코드를 삽입하여서(공지) 공지를 만들어 내는 이벤트.

#### 3.2.3 sending
```javascript
chatInput.addEventListener('keypress', function(e){
  if (e.keyCode === 13) {
    send();
  }
});

function send() {
  const param = {
    name: nickname.value,
    msg: chatInput.value,
  };
  socket.emit('chatting', param);
}

sendButton.addEventListener('click', send);
```
실행될 때 서버로 chatting 이벤트를 보내는 send 함수를 제작하여 
sendButton에 눌렸을 때 send 함수를 실행시키도록 하고
keypress, 13번, 엔터를 눌렀을 때 send 함수를 실행시키도록 함.
