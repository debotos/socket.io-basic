const socket = io();

socket.on('newConnection', (count) => {
  console.log('Connected Client ', count);
});

document.querySelector('#increment').addEventListener('click', () => {
  console.log('Clicked!');
  socket.emit('increment');
})