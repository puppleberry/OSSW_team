var socket = io()

socket.on('connect', function(){
    var input = document.getElementById('test')
    input.value = 'connection complete'
})

function send(){
    var message = document.getElementById('test').value

    document.getElementById.value = ''
    socket.emit('send', {msg: message})
}