const { rooms } = require("./Create");

const leave = (socket) => ({ roomName }) => {
    console.log(rooms);
    socket.leave(roomName);
    console.log(`Bruker ${socket.id} har forlatt rommet ${roomName}`);
    rooms[roomName].players.pop(socket.id);
    if(rooms[roomName].players.length === 0){
        console.log(`Rommet ${roomName} er tomt og blir slettet`);
       rooms.pop(roomName);
       delete rooms[roomName];
       console.log(rooms);
    }
}
exports.leave = leave;
