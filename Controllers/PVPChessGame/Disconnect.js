/**
 * @description Socket for å lage rom for miste forbindelse til serveren, logge av etc.
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

//TODO får error, disconnect funker ikke.

const disconnect = (socket) => (connectedUsers, reason) => {
  if (connectedUsers.has(socket.user.id)) {
    console.log(
      `User ${
        connectedUsers.get(socket.id).username
      } disconnected because: ${reason}`
    );
    connectedUsers.delete(socket.user.id);
  } else {
    console.log(`No user found with socket ID: ${socket.id}`);
  }
  return connectedUsers;
};
module.exports = disconnect;
