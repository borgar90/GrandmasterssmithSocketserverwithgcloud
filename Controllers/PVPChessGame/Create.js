const {
  saveRoom,
  getAllRooms,
  Room,
  updateRoom,
} = require("../../Modells/RoomSchema");
let rooms = [];
exports.rooms = rooms;

const create = (socket, io) => async (data, userRooms) => {
  const { roomName, player, eloMin, eloMax } = data;

  let room = {
    name: roomName,
    eloMin: eloMin,
    eloMax: eloMax,
    players: [],
    spectators: [],
    bannedSpectators: [],
  };
  /*
  socket.join({
    roomName: data.roomName,
    player: data.player,
    role: "player",
    color: "hvit",
  }); //TODO color er hardkodet, må la bruker velge i ferdig versjon
  */
  //socket.join(roomName);
  room.players.push({
    socketId: socket?.user?._id,
    player: socket?.user,
    role: "player",
    color: "hvit",
  });

  if (userRooms.has(socket.user._id)) {
    console.log("User already in room");
    socket.emit("error", "You are already in a room.");
    return;
  } else {
    userRooms.set(socket.user._id, roomName);
    await saveRoom(room);
    io.emit("rooms_updated", await getAllRooms());
    console.log(`Bruker ${socket.id} har opprettet rommet ${roomName}`);
    // Set a timeout to mark the room as inactive and remove it after 2 seconds
    setTimeout(async () => {
      // Update the room status in the database
      await Room.updateOne({ name: roomName }, { $set: { active: false } });

      // Emit the updated list of rooms to all clients
      io.emit("rooms_updated", await getAllRooms());

      console.log(
        `Room ${roomName} has been set to inactive and removed from the list.`
      );
    }, 1000 * 60 * 60); // 1 hour
  }
};

exports.create = create;
