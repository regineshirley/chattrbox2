var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];

console.log('websockets server started');

ws.on('connection', function(socket) {
    console.log('client connection established');

    messages.forEach(function(msg) { //all new users to see all the previous messages
        socket.send(msg);
    });

    socket.on('message', function(data) {
        console.log('message received: ' + data);
        messages.push(data); //add each new message to messages array as it arrives
        ws.clients.forEach(function(clientSocket) { //send new messages to all the new users
            clientSocket.send(data);
        });
    });
});
