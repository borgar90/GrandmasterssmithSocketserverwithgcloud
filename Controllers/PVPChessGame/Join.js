
const e = require("cors");
const rooms = require("./Create");

const join = (socket) => (data) => {
  const { roomName, player, role } = data;
  const room = rooms[roomName];
  if (!room) {
    socket.emit("error", "Rommet finnes ikke");
    return;
  }



  if (room.players.length >= 2) {
    socket.emit("error", "Rommet er fullt");
    return;
  }

  if (role === "player" && room.players.length < 2) {
    room.players.push(player);
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

// Controllers/PVPChessGame/Join.js
// Controllers/PVPChessGame/Join.js
/*
const e = require("cors");
const rooms = require("./Create");
console.log(rooms);
const join = (socket) => (data) =>{

    const { roomName, player, color,role } = data;
    const room = rooms[roomName];
      // Ensure the room exists
      if (!room) {
          socket.emit('error', 'Room does not exist.');
          return;
      }

      // Check room capacity (limit to 2 players)
      if (room.players.length >= 2) {
          socket.emit('error', 'Room is full.');
          return;
      }

      // Disallow spectators
      if (data.spectator) {
          socket.emit('error', 'Spectators are not allowed.');
          return;
      }

      // Ensure user is not in another room
      const currentRooms = Array.from(socket.rooms).filter(r => r !== socket.id);
      if (currentRooms.length > 0) {
          socket.emit('error', 'You are already in another room.');
          return;
      }
/*
      if (role === "player" && room.players.length < 2) {
        room.players.push(player);
        socket.join(roomName);
        socket.to(roomName).emit("new_player", socket.id);
        socket.emit(`Spiller ${socket.id} har sluttet seg til rommet ${roomName} som ${room.players.length === 1 ? "hvit" : "sort"}`);
      } else if (role === "spectator" && !room.bannedSpectators.includes(socket.id)) {
        room.spectators.push(socket.id);
        socket.join(roomName);
        socket.emit(`Tilskuer ${socket.id} har sluttet seg til rommet ${roomName}`);
      } else {
        socket.emit("error", "Kan ikke bli med i rommet");
      }
      */
     /*
     socket.join(roomName);
      room.players.push(player);
      socket.to(roomName).emit("new_player", socket.id);
      socket.emit(`Spiller ${socket.id} har sluttet seg til rommet ${roomName} som ${room.players.length === 1 ? "hvit" : "sort"}`);

    };
  
     
  

exports.join = join;

*/
