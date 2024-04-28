const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const corsOptions = require("./cors");
const { create } = require("./Controllers/PVPChessGame/Create");
const { join } = require("./Controllers/PVPChessGame/Join");
const { disconnect } = require("./Controllers/PVPChessGame/Disconnect");
const { leave } = require("./Controllers/PVPChessGame/Leave");
const { getAllRooms, getAllRoomsWithUser } = require("./Modells/RoomSchema");
const { getUser } = require("./Modells/User");
const ChessEngine = require("./Controllers/Chess/engine");
const { move } = require("./Controllers/PVPChessGame/Move");
const RequestRooms = require("./Controllers/PVPChessGame/RequestRooms");
const { StartGame } = require("./Controllers/PVPChessGame/StartGame");
const userAuth = require("./Middleware/SocketIO");
const connectedUsers = new Map();
const userRooms = new Map();
const activeGames = new Map();

module.exports = async function (socketServer) {
  const io = socketIo(socketServer, {
    cors: corsOptions,
  });

  io.use(async (socket, next) => userAuth(socket, next)(connectedUsers));

  io.on("connection", async (socket) => {
    if (!socket.user._id) return;
    checkIfUserIsConnected(socket, io);

    socket.on("request_rooms", async () => RequestRooms(io)());

    isParticipant(socket);

    socket.on("create", (data) => create(socket, io)(data, userRooms));
    socket.on("join", (data) => join(socket, io)(data, userRooms));
    socket.on("leave", (data) => leave(socket, io)(userRooms, data));

    socket.on("start_game", (data) => StartGame(socket, io)(data));
    socket.on("move", (data) => move(socket, io)(data));

    socket.on("disconnect", (reason) => {
      const newConnectedUsers = disconnect(socket)(connectedUsers, reason);
      connectedUsers = newConnectedUsers;
      updateUserList(io);
    });
  });
};

function checkIfUserIsConnected(socket, io) {
  if (!socket?.user?._id) {
    return;
  }
  const alreadyConnected = Array.from(connectedUsers.values()).find(
    (u) => u._id.toString() === socket.user._id.toString()
  );
  if (!alreadyConnected) {
    connectedUsers.set(socket.user._id, socket.user);
  }

  updateUserList(io);
}

function listAllConnectedUsers() {
  console.log("Connected users:", Array.from(connectedUsers.values()));
  return Array.from(connectedUsers.values());
}

function updateUserList(io) {
  io.emit("updateUserList", listAllConnectedUsers());
}

async function isParticipant(socket) {
  const participant = await getAllRoomsWithUser(socket.user._id);

  if (participant) {
    userRooms.set(
      participant.id,
      participant // Just the name of the first room where the user is a participant
    );
  } else {
    console.log("No room found with user participation.");
  }
}
