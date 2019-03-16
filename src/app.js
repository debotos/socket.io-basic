const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

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
  # 3 ways via the server can emit event
  socket.emit();           // This emit event for current client(particular)
  io.emit();               // This emit event for all client including current
  socket.broadcast.emit()  // This emit event for all client except current one

  # Built-in Events
  io.on('connection')      // Used for new connection(Note that io.on(<built in event>))
  socket.on('disconnect')  // Run whenever a client gets disconnected

  # Event Acknowledgement
  Via acknowledgement the client would get notified that the message(content) delivered successfully.
  Simply, the client would get notified that the server processed the content that begin sent.
  It can be reverse means server would get notified if the message delivered successfully to client.
  It's just a matter of setting callback in server or client emited event.

  server(emit) -> client(receive) --acknowledgement--> server
  client(emit) -> server(receive) --acknowledgement--> Client

  It provided via 3rd argument of emit() like,
    emit(nameOfTheEvent, data, acknowledgementFunction)
  It accessed via 2nd argunent of on() like,
    on(nameOfTheEvent, (data, acknowledgementFunction) => { acknowledgementFunction() })
*/
io.on('connection', (socket) => {
  socket.emit('message', 'Welcome!');

  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()

    if (filter.isProfane(message)) {
      // This is an example of 'acknowledgement '
      // It is going to check the message and if it contains Profanity it will stop execution
      // it is using return keyword. so nothing will execute after it.
      return callback('Profanity is not allowed!');
    }

    io.emit('message', message);
    callback();
  })

  socket.on('sendLocation', (coords, sendStatus) => {
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    sendStatus('Location shared!');
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });
})

module.exports = {
  app, // for testing suite
  server
};