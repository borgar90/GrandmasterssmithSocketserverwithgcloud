const { getAllRooms } = require("../../Modells/RoomSchema");

const RequestRooms = (io) => async () => {
  console.log("Request rooms event triggered");
  const allRooms = await getAllRooms();
  allRooms?.map((room) => {
    console.log("element", room);
  });

  io.emit("rooms_updated", allRooms);
  console.log("Rooms updated sent:", allRooms.length);
};
module.exports = RequestRooms;
