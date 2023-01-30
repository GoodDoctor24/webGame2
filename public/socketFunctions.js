const socket = io('http://localhost:3003');

document.getElementById('btnClick').addEventListener('click', function(){
    console.log('start')
    socket.emit('chat-message', $('#message').val());
    console.log('finish')
    $('#message').val('');
    return false;
})

socket.on('chat-message', (msg) => {
    $('#messages').append($('<li>').text(msg));
});