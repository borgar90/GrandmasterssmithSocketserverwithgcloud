const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const corsOptions = require("./cors");
const { create } = require("./Controllers/PVPChessGame/Create");
const { join } = require("./Controllers/PVPChessGame/Join");
const { disconnect } = require("./Controllers/PVPChessGame/Disconnect");
const { leave } = require("./Controllers/PVPChessGame/Leave");
const { getAllRooms, getAllRoomsWithUser } = require("./Modells/RoomSchema");
const { getUser } = require("./Modells/UserNewImplementation");
const ChessEngine = require("./Controllers/Chess/engine");
const connectedUsers = new Map();
const userRooms = new Map();

module.exports = async function (socketServer) {
  const io = socketIo(socketServer, {
    cors: corsOptions,
  });

  io.use(async (socket, next) => {
    const userID = socket.handshake.query.userID;

    try {
      const user = await getUser(userID);
      if (!user) {
        return next(new Error("User not found"));
      }
      const alreadyConnected = Array.from(connectedUsers.values()).some(
        (u) => u._id === user._id
      );
      if (alreadyConnected) {
        return next(new Error("User already connected"));
      }

      socket.user = user;
      console.log("User in middleware", socket.user);
      connectedUsers.set(socket.id, socket.user);
      updateUserList();
      next(); // Continue to connection handlers
    } catch (error) {
      console.error("Error fetching user:", error);
      next(new Error("Authentication failed")); // Pass an error if user cannot be authenticated
    }
  });
  function updateUserList() {
    io.emit("updateUserList", listAllConnectedUsers());
  }

  io.on("connection", async (socket) => {
    if (!socket?.user?._id) {
      return;
    }

    socket.on("request_rooms", async () => {
      console.log("Request rooms event triggered");
      const allRooms = await getAllRooms();
      socket.emit("rooms_updated", allRooms);
      console.log("Rooms updated sent:", allRooms.length);
      // If a callback is provided, call it
    });

    const participant = await getAllRoomsWithUser(socket.user._id);

    if (participant) {
      userRooms.set(
        socket.user._id,
        participant // Just the name of the first room where the user is a participant
      );
      console.log("First room with user participation:", participant);
    } else {
      console.log("No room found with user participation.");
    }

    console.log(`User ${socket.user.username} connected`);

    console.log("En bruker koblet til:", socket.user.username);

    //    socket.on("create", create(socket));
    //   socket.on("join", (data) => join(socket)(data));

    socket.on("create", (data) => create(socket, io)(data, userRooms));
    socket.on("join", (data) => join(socket, io)(data, userRooms));
    socket.on("disconnect", () => disconnect(socket)()); //TODO lage timer for room delete!
    socket.on("leave", (data) => leave(socket, io)(userRooms));
    socket.on("start_game", (data) => {
      const engine = new ChessEngine();
      userRooms.get(socket.user._id).chessGame = engine.newGame();
      io.emit("game_started", userRooms.get(socket.user._id).chessGame);
    });
    socket.on("move", (data) => {
      const move = userRooms.get(socket.user._id).chessGame.chessMove(data);

      if (move) {
        io.emit("move_made", move);
      } else {
        socket.emit("invalid_move", "Invalid move");
      }
    });

    socket.on("disconnect", (reason) => {
      if (connectedUsers.has(socket.id)) {
        console.log(
          `User ${
            connectedUsers.get(socket.id).username
          } disconnected because: ${reason}`
        );
        connectedUsers.delete(socket.id);
      } else {
        console.log(`No user found with socket ID: ${socket.id}`);
      }
      updateUserList();
    });
  });

  /*
  io.on("connection", (socket) => {
    console.log(`${socket.user.username} connected`);

    socket.on("chat message", (msg) => {
      //console.log(`${socket.user.username} sent a message: ${msg}`);
      // Handle the chat message
      //io.emit("chat message", { user: socket.user, message: msg });
    });

    socket.on("request_rooms", async () => {
      socket.emit("rooms_updated", await getAllRooms());
    });

    console.log("En bruker koblet til:", socket.id);

    //    socket.on("create", create(socket));
    //   socket.on("join", (data) => join(socket)(data));

    socket.on("create", (data) => create(socket, io)(data));
    socket.on("join", (data) => join(socket, io)(data));
    socket.on("disconnect", () => disconnect(socket)());
    socket.on("leave", (data) => leave(socket)(data));

    //TODO forsikre at om en bruker med en id alerede er i et rom, så kan de ikke bli med i et annet rom, eller bli med i rommet på nytt
    //TODO da er dem allerede i rommet, og det skal vedvare, men server skal ikke crashe!
    //TODO forsikre bare to spillere i et rom

    //!! ikke like viktig!
    //TODO forsikre at en bruker ikke kan bli med i et rom som tilskuer
    //TODO forsikre at en bruker som er tilskuer ikke kan bli med i et rom som spiller
    //TODO lage metode for make_move og sende til motspiller
    //TODO lage metode for å sende tilskuerne oppdateringer
    //TODO lage metode for å la tilskuerne chate
    //!! Nedprioritet: webcam!!!

    //TODO: lage ferdig leave og disconnect
    //!!VIKTIG!
    /*
    socket.on("leave", ({ roomName }) => {
      socket.leave(roomName);
      console.log(`Bruker ${socket.id} har forlatt rommet ${roomName}`);
    });
*/
  /*
    socket.on("disconnect", () => {
      console.log(`Bruker ${socket.id} har koblet fra`);
      // Her må du håndtere gjeninnkobling og forfith logikk
    });
 */
  // });
};

function listAllConnectedUsers() {
  return Array.from(connectedUsers.values());
}
