var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    console.log("Client connected!");
    socket.on('message', function(data) {
        console.log("Recvd: ", data);
    });
});
