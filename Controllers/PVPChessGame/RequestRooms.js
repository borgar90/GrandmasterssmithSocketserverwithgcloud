const { getAllRooms } = require("../../Modells/RoomSchema");

/**
 * @description Socket for å liste om tilgjengelige rom for sjakkspill
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const RequestRooms = (io) => async () => {
  console.log("Request rooms event triggered");
  const allRooms = await getAllRooms();

  io.emit("rooms_updated", allRooms);
  console.log("Rooms updated sent:", allRooms.length);
};
module.exports = RequestRooms;
