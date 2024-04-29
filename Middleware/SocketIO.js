const { getUser } = require("../Modells/User");

/**
 * @description middleware for å autentisere bruker ved hjelp av socket.io
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const userAuth = (socket, next) => async (connectedUsers) => {
  const userID = socket.handshake.query.userId;
  const userPicture = socket.handshake.query.picture;

  try {
    let user = await getUser(userID);
    console.log("User:", user);
    if (!user) {
      return next(new Error("User not found"));
    }
    const alreadyConnected = Array.from(connectedUsers.values()).some(
      (u) => u._id === user._id
    );
    if (alreadyConnected) {
      return next(new Error("User already connected"));
    }
    user.photo = userPicture;
    socket.user = user;

    next(); // Continue to connection handlers
  } catch (error) {
    console.error("Error fetching user:", error);
    next(new Error("Authentication failed")); // Pass an error if user cannot be authenticated
  }
};

module.exports = userAuth;
