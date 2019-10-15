// app.js
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://chat.onlinesoppa.me:443']);
io.set('origins', '*:*');

const users = [];
let messageId = 0;
io.on('connection', function(socket) {
    console.info('User Connected');
    socket.on('set nickname', function(nickname) {
        let time = new Date();
        socket.nickname = nickname;
        users.push(nickname);
        console.info('Logged in as ' + socket.nickname);
        socket.emit('set nickname', socket.nickname);
        const broadcast = {
            id: ++messageId,
            time:
                (time.getHours() < 10
                    ? '0' + time.getHours()
                    : time.getHours()) +
                ':' +
                (time.getMinutes() < 10
                    ? '0' + time.getMinutes()
                    : time.getMinutes()),
            user: 'System',
            message: socket.nickname + ' Connected.',
        };
        io.emit('broadcast', broadcast);
        socket.emit('save broadcast', broadcast);
        io.emit('get users', users);
    });
    socket.on('chat message', function(message) {
        ++messageId;
        let time = new Date();
        console.info('Message recieved:', message);
        const formatted_msg = {
            id: messageId,
            user: socket.nickname,
            message: message,
            time:
                (time.getHours() < 10
                    ? '0' + time.getHours()
                    : time.getHours()) +
                ':' +
                (time.getMinutes() < 10
                    ? '0' + time.getMinutes()
                    : time.getMinutes()),
        };
        socket.emit('chat message', formatted_msg);
        io.emit('all chat', formatted_msg);
    });
    socket.on('get users', function() {
        console.info('get users');
        socket.emit('get users', users);
        console.log(users);
    });
    socket.on('disconnect', function() {
        console.info('Client disconnected');
        var index = users.indexOf(socket.nickname);
        users.splice(index, 1);
        io.emit('get users', users);
    });
});

server.listen(8300);
console.log('Listentning to 8300');
