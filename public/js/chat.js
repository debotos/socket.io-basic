const socket = io();

socket.on('message', (message) => {
  console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const message = event.target.elements.message.value;

  /*
    'sendMessage' is the event name after that everything is
    an argument of .on() receiver's callback function in serverside
    Here, 'message' and 'the function' is passed as 1st & 2nd argument

    so, in short, 2nd & 3rd argument of emit() will be 
    the 1st & 2nd argument of on() function's callback 
  */
  socket.emit('sendMessage', message, (error) => {
    if (error) { // stop execution via acknowledagement
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});

document.querySelector('#share-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert("Your browser doesn't support Geolocation.");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      console.log(message);
    })
  });

});