const {
  updateRoom,
  deleteRoom,
  getAllRoomsWithUser,
  getAllRooms,
} = require("../../Modells/RoomSchema");
const leave = (socket, io) => async (userRooms) => {
  if (!socket?.user?._id) {
    console.log("No user ID found on socket.");
    return;
  }

  // Retrieve the list of rooms the user is currently in, which could be undefined if the user is in no rooms
  const currentUserRoom = await getAllRoomsWithUser(socket?.user?._id);
  if (!currentUserRoom) {
    return;
  }
  // Filter out the room that the user wants to leave
  const updatedPlayers = currentUserRoom.players.filter(
    (player) => player.player._id.toString() !== socket.user._id.toString()
  );

  currentUserRoom.players = updatedPlayers;
  console.log("Updated players list:", currentUserRoom.players);

  // Delete user from userRooms map if they're no longer in any room
  userRooms.delete(socket.user._id);

  if (currentUserRoom?.players?.length === 0) {
    await deleteRoom(currentUserRoom);
  } else {
    await updateRoom(currentUserRoom);
  }
  io.emit("rooms_updated", await getAllRooms());
  // Optionally, you can log this action or handle additional logic here
  console.log(
    `User ${socket?.user?.username} left room: ${currentUserRoom?.name}`
  );
};

exports.leave = leave;
