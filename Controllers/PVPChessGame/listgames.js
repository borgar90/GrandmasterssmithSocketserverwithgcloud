const rooms = require("./Create");

/**
 * @description Socket for å kunngjøre antall rom som er tilgjengelige for spillere skal også liste alle rom.
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const displaygames = (socket) => (io) => {
  const amountofrooms = Object.keys(io.sockets.adapter.rooms).length;
  socket.emit("roomsList", amountofrooms);
  console.log("amount of rooms from server: " + amountofrooms.length);
};
exports.displaygames = displaygames;
