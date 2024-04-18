
const e = require("cors");
const rooms = require("./Create");

const join = (socket) => (data) => {

  console.log("nybruker joinet nå : "+socket.id);
  console.log(rooms +"list of rooms when joining");
  
  const { roomName, player, role } = data;
  const room = rooms[roomName];
  if (!room) {
    socket.emit("error", "Rommet finnes ikke");
    return;
  }



  if (room.players.length >= 2) {
    socket.emit("error", "Rommet er fullt");
    console.log("Rommet er fullt");
    return;
  }

  if (role === "player" && room.players.length < 2) {
    room.players.push({ socketId: socket.id, player:player, role: "player", color: "hvit"});
   
    console.log("Spiller koblet til matchen: "+socket.id);
    //socket.join(roomName);
    //socket.to(roomName).emit("new_player", socket.id);
  //  socket.emit(`Spiller ${socket.id} har sluttet seg til rommet ${roomName} som ${room.players.length === 1 ? "hvit" : "sort"}`);
  } else if (role === "spectator" && !room.bannedSpectators.includes(socket.id)) {
    room.spectators.push(socket.id);
   // socket.join(roomName);
   // socket.emit(`Tilskuer ${socket.id} har sluttet seg til rommet ${roomName}`);
  } else {
    socket.emit("error", "Kan ikke bli med i rommet");
  }
  rooms[roomName] = room;
  socket.emit("rooms_updated", room);
};


exports.join = join;

