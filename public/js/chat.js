const socket = io();

// Elements
/*
  Putting $ sign in front of variable is a convention
  Letting me know that what i have in this variable is an element
*/
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationShareButton = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// Options
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true // it removes '?'
}); // Query String parser lib

socket.on('message', ({
  text,
  createdAt
}) => {
  console.log(text);
  const html = Mustache.render(messageTemplate, {
    message: text, // pass the value
    createdAt: moment(createdAt).format('h:mm a')
  }); // Mustache templating lib
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', ({
  location,
  createdAt
}) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    location,
    createdAt: moment(createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = event.target.elements.message.value; // 'message' is the name attribute
  // validation
  if (!message.trim()) return;

  // disable the form
  $messageFormButton.setAttribute('disabled', 'disabled');

  /*
    'sendMessage' is the event name after that everything is
    an argument of .on() receiver's callback function in serverside
    Here, 'message' and 'the function' is passed as 1st & 2nd argument

    so, in short, 2nd & 3rd argument of emit() will be 
    the 1st & 2nd argument of on() function's callback 
  */
  socket.emit('sendMessage', message, (error) => {
    // enable the form
    $messageFormButton.removeAttribute('disabled');
    // clean up
    $messageFormInput.value = '';
    // focus back
    $messageFormInput.focus()

    if (error) { // stop execution via acknowledagement
      return console.log(error);
    }

    console.log('Message delivered!');
  });
});


$locationShareButton.addEventListener('click', () => {
  // disable the button
  $locationShareButton.setAttribute('disabled', 'disabled');
  // check support
  if (!navigator.geolocation) {
    return alert("Your browser doesn't support Geolocation.");
  }
  // get the coords
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      $locationShareButton.removeAttribute('disabled');
      console.log(message);
    })
  });

});


socket.emit('join_room', {
  username,
  room
});