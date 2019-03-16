const generateMessage = (text) => ({
  text,
  createdAt: new Date().getTime()
})

const generateLocationMessage = (coords) => ({
  location: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
  createdAt: new Date().getTime()
})

module.exports = {
  generateMessage,
  generateLocationMessage
}