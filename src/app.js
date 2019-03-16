const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express(); // 1. create express app
const server = http.createServer(app); // 2. put express app inside httpServer
const io = socketio(server) // 3. put httpServer inside SocketIO
/* 
  SocketIO expects it to be called with the raw HTTP Server
  But it's not possible with express because express also
  does that but under the hood. That's why all these thing...
*/

const publicDirectoryPath = path.join(__dirname, '../public');

// Middleware
app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
  console.log('New Client Connected!');
  socket.emit('newConnection', count);
  socket.on('increment', () => {
    count++;
    // socket.emit('newConnection', count); // This emit for current client
    io.emit('newConnection', count); // This emit for all client
  })
})

module.exports = {
  app, // for testing suite
  server
};