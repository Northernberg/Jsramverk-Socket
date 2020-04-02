// app.js
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://localhost:8001']);
io.set('origins', '*:*');

io.on('connection', function(socket) {
    console.info('User Connected');
    socket.on('Update stock', function(res) {
        console.info('Stock updated', res);
        io.emit('broadcast', res.value);
    });
    socket.on('disconnect', function() {
        console.info('Client disconnected');
    });
});

server.listen(8300);
console.log('Listentning to 8300');
