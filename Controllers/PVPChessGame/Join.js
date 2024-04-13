const rooms = require("./Create");

const join = (socket) => (data) => {
  const room = rooms[data.roomName];
  if (!room) {
    socket.emit("error", "Rommet finnes ikke");
    return;
  }

  if (role === "player" && room.players.length < 2) {
    room.players.push(data.player);
    socket.join(data.roomName);
    socket.to(data.roomName).emit("new_player", socket.id);
    console.log(
      `Spiller ${socket.id} har sluttet seg til rommet ${data.roomName} som ${
        room.players.length === 1 ? "hvit" : "sort"
      }`
    );
  } else if (
    role === "spectator" &&
    !room.bannedSpectators.includes(socket.id)
  ) {
    room.spectators.push(socket.id);
    socket.join(data.roomName);
    console.log(
      `Tilskuer ${socket.id} har sluttet seg til rommet ${data.roomName}`
    );
  } else {
    socket.emit("error", "Kan ikke bli med i rommet");
  }
};

exports.join = join;
