// app.js
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://chat.onlinesoppa.me:443']);
io.set('origins', '*:*');

const users = [];
io.on('connection', function(socket) {
    console.info('User Connected');
    socket.on('set nickname', function(res) {
        socket.nickname = res.nick;
        users.push(res.nick);
        console.info('Logged in as ' + socket.nickname);
        socket.emit('set nickname', socket.nickname);
        const broadcast = {
            time: res.date,
            user: 'System',
            message: socket.nickname + ' Connected.',
        };
        io.emit('broadcast', broadcast);
        socket.emit('save broadcast', broadcast);
        io.emit('get users', users);
    });
    socket.on('chat message', function(res) {
        console.info('Message recieved:', res.message);
        const formatted_msg = {
            user: socket.nickname,
            message: res.message,
            time: res.date,
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
