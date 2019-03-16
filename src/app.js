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

/*
  socket.emit(); // This emit event for particular client
  io.emit();     // This emit event for all client
*/
io.on('connection', (socket) => {
  socket.emit('message', 'Welcome!');
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  })
})

module.exports = {
  app, // for testing suite
  server
};