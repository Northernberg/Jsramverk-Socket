// app.js
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://chat.onlinesoppa.me:443']);

const users = [];
let messageId = 0;
let time = new Date();
io.on('connection', function(socket) {
    console.info('User Connected');
    socket.on('set nickname', function(nickname) {
        socket.nickname = nickname;
        users.push(nickname);
        console.info('Logged in as ' + socket.nickname);
        socket.emit('set nickname', socket.nickname);
        io.emit('broadcast', {
            id: ++messageId,
            time: time.getHours() + ':' + time.getMinutes(),
            user: 'System',
            message: socket.nickname + ' Connected.',
        });
        console.log(users);
        // io.emit('get users', users);
    });
    socket.on('chat message', function(message) {
        ++messageId;
        let time = new Date();
        console.info('Message recieved:', message);
        io.emit('chat message', {
            id: messageId,
            user: socket.nickname,
            message: message,
            time:
                time.getHours() +
                ':' +
                (time.getMinutes() < 10
                    ? '0' + time.getMinutes()
                    : time.getMinutes()),
        });
    });
    socket.on('get users', function() {
        console.info('get users');
        socket.emit('get users', users);
    });
    socket.on('disconnect', function() {
        console.info('Client disconnected');
        var index = users.indexOf(socket.nickname);
        users.splice(index, 1);
    });
});

server.listen(8300);
console.log('Listentning to 3000');
