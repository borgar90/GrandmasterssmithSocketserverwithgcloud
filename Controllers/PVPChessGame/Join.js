const {
  getRoom,
  getAllRooms,
  updateRoom,
  getAllRoomsWithUser,
} = require("../../Modells/RoomSchema");

const join = (socket, io) => async (data, userRooms) => {
  const room = await getRoom(data.id);

  if (!room) {
    socket.emit("error", "Rommet finnes ikke");
    return;
  }

  if (room.players?.length >= 2) {
    socket.emit("error", "Rommet er fullt");
    return;
  }

  room.players.push({
    socketId: socket?.user?._id,
    player: socket?.user,
    role: "player",
    color: "sort",
  });

  const currentRoom = await getAllRoomsWithUser(socket.user._id);

  if (currentRoom) {
    socket.emit("error", "You are already in a room.");
  } else {
    userRooms.set(socket.user._id, room);
    await updateRoom(room);
    if (room.players.length === 2) {
      io.emit("game_ready", room);
    }
    io.emit("rooms_updated", await getAllRooms());
  }

  /*
  if (role === "player" && room.players.length < 2) {
    room.players.push({
      socketId: socket.id,
      player: player,
      role: "player",
      color: "hvit",
    });

    console.log("Spiller koblet til matchen: " + socket.id);
    //socket.join(roomName);
    //socket.to(roomName).emit("new_player", socket.id);
    //  socket.emit(`Spiller ${socket.id} har sluttet seg til rommet ${roomName} som ${room.players.length === 1 ? "hvit" : "sort"}`);
  } else if (
    role === "spectator" &&
    !room.bannedSpectators.includes(socket.id)
  ) {
    room.spectators.push(socket.id);
    // socket.join(roomName);
    // socket.emit(`Tilskuer ${socket.id} har sluttet seg til rommet ${roomName}`);
  } else {
    socket.emit("error", "Kan ikke bli med i rommet");
  }
  rooms[roomName] = room;
  socket.emit("rooms_updated", room);
  */
};

exports.join = join;
