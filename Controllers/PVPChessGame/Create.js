let rooms = {};
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

  newSocket.join({
    roomName: data.roomName,
    player: data.player,
    role: "player",
    color: "white",
  }); //TODO color er hardkodet, må la bruker velge i ferdig versjon
  console.log(`Rom opprettet: ${roomName}`);
};
exports.create = create;
