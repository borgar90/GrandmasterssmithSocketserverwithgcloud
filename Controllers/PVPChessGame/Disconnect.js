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
