var http = require('http'),
    path = require('path'),
    fs   = require('fs'),
    url  = require('url');

var server = http.createServer(function(request, response){
    //static file server
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    console.log("URI: " + uri);
    console.log("Filename: " + filename);
    path.exists(filename, function(exists) {
        if(exists){
            fs.stat(filename, function(err, stat) {
                var rs;
                if (err) {
                    response.writeHead(500);
                    response.end("Error reading the file");
                }
                if(stat.isDirectory()){
                    response.writeHead(403);
                    response.end("Cannot display directories!");
                }
                else{
                    rs = fs.createReadStream(filename);
                    response.writeHead(200);
                    rs.pipe(response);
                }
            });
        }
        else{
            response.writeHead(404);
            response.end("404!");
        }
    });
});

server.listen(8000);
console.log("Server started!");

//attach socket.io to our http static file server
var io = require('socket.io').listen(server);
console.log("SocketIO started!");

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
