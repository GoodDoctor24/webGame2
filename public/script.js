
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

$("#btnClickToCreateRoom").click(function(){
    const timeInfo = new Date();
    roomObj = {
        roomName : $('#message').val(),
        roomType : $("#roomType").val(),
        roomPassword : (roomType === 'Private') ? $('#roomPassword').val() : '',
        roomId : timeInfo.getDate() + '_' + timeInfo.getDay() + '_' + timeInfo.getHours() + '_' + timeInfo.getMinutes() + '_' + timeInfo.getSeconds() + '_' + timeInfo.getMilliseconds()
    }
    console.log(roomObj);
 });

$("#roomType").change(function(){
    var selectedOption = $(this).val();
    // do something with selectedOption
    if (selectedOption === 'Private'){
        $("#roomPassword").css('display' ,'block');
    }
 });

