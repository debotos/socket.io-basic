const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message);
})