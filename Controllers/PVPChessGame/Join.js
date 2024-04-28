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

  socket.join(data.id);
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
    await updateRoom(room);
    userRooms.set(socket.user._id, room._id);
    socket.join(room._id);
    if (room.players.length === 2) {
      io.to(room._id).emit("game_ready", room);
    } else {
      io.to(room._id).emit("room_updated", room);
    }
  }
};

exports.join = join;
