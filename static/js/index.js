'use strict';

const socket = io();
const nickname = document.querySelector('#nickname');
const chatList = document.querySelector('.chatting-list');
const chatInput = document.querySelector('.chatting-input');
const sendButton = document.querySelector('.send-button');
const displayContainer = document.querySelector('.display-container');

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

function Li(name, msg) {
  this.name = name;
  this.msg = msg;
    
  this.makeLi = () => {
    const li = document.createElement('li');
    li.classList.add(nickname.value === this.name ? 'sent' : 'received');
    const dom = `<span class="profile">
    <span class="user">${this.name}</span>
    <img class="image" src="https://placeimg.com/50/50/any" alt="any" />
    </span>
    <span class="message">${this.msg}</span>`;
  
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

function announement(msg){
  this.msg = msg;

  this.makeAn = () => {
    const li = document.createElement('li');
    li.classList.add('announce');
    const dom = `<span class="broadcast">${this.msg}</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

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