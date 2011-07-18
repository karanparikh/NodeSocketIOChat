var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    console.log("Client connected!");

    //set the username
    socket.on('set_nickname', function(nickname) {
        socket.nickname = nickname;
        socket.broadcast.emit('new_user', nickname);
    });

    //message recvd from the client socket
    socket.on('message', function(data) {
        var now = new Date();
        var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        data = "<i>" + socket.nickname + "[" + time + "]:</i> " + data;
        console.log("Recvd: ", data);
        io.sockets.emit('chat', data);
    });
});
