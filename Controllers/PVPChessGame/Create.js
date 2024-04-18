let rooms = [];
exports.rooms = rooms;

const create = (newSocket) => (data) => {

  const { roomName, player } = data;
  if (rooms[roomName]) {
    socket.emit("error", "Rommet eksisterer allerede");
    return;
  }

  rooms[roomName] = {
    players: [],
    spectators: [],
    bannedSpectators: [],
  };
/*
  newSocket.join({
    roomName: data.roomName,
    player: data.player,
    role: "player",
    color: "hvit",
  }); //TODO color er hardkodet, må la bruker velge i ferdig versjon
  */
  newSocket.join(roomName);
rooms[roomName].players.push({ socketId: newSocket.id, player:data.player, role: "player", color: "hvit"});
  console.log(`Bruker ${newSocket.id} har opprettet rommet ${roomName}`);

  newSocket.emit("rooms_updated", Object.keys(rooms));
console.log(Object.keys(rooms).length +" antall rom");
  
  
};

exports.create = create;
