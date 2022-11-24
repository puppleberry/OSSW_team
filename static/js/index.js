var socket = io()

socket.on('connect', function() {
  var name = prompt('반갑습니다!', '')
  if(!name) {
    name = '익명'
  }
  socket.emit('newUser', name)
})

socket.on('update', function(data) {
  var chat = document.getElementById('chat')

  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)
})


function send() {
  var message = document.getElementById('test').value
  
  document.getElementById('test').value = ''

  var chat = document.getElementById('chat')
  var msg = document.createElement('div')
  var node = document.createTextNode(message)
  msg.classList.add('me')
  msg.appendChild(node)
  chat.appendChild(msg)

  socket.emit('message', {type: 'message', message: message})
}