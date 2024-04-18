const rooms = require('./Create');
const displaygames = (socket) => (io) => {
const amountofrooms =  Object.keys(io.sockets.adapter.rooms).length
socket.emit('roomsList', amountofrooms);
console.log("amount of rooms from server: " + amountofrooms.length);
}
exports.displaygames = displaygames;