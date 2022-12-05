'use strict';

const socket = io();
const nickname = document.querySelector('#nickname');
const chatList = document.querySelector('.chatting-list');
const chatInput = document.querySelector('.chatting-input');
const sendButton = document.querySelector('.send-button');

socket.on('chatting', function(data){
  const { name, msg, time } = data;
  const item = new Li(name, msg, time);
  item.makeLi();
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

sendButton.addEventListener('click', () => {
  const param = {
    name: nickname.value,
    msg: chatInput.value,
  };
  socket.emit('chatting', param);
});