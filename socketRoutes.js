const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const corsOptions = require("./cors");
const { create } = require("./Controllers/PVPChessGame/Create");
const { join } = require("./Controllers/PVPChessGame/Join");
const { disconnect } = require("./Controllers/PVPChessGame/Disconnect");
const { leave } = require("./Controllers/PVPChessGame/Leave");

module.exports = function (socketServer) {
  const io = socketIo(socketServer, {
    cors: corsOptions,
  });
  /*
  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      // User is authenticated, you can access decoded information
      socket.user = decoded.user; // Assign user information to the socket
      next();
    });
  });
*/
  io.on("connection", (socket) => {
    //console.log(`${socket.user.username} connected`);
   
    socket.on('list_rooms', () => {
      const rooms = Object.keys(io.sockets.adapter.rooms).filter(room => room); // Filter or modify according to your setup
      socket.emit('room_list', rooms);
  });
    socket.on("disconnect", () => {
      //console.log(`${socket.user.username} disconnected`);
    });

    socket.on("chat message", (msg) => {
      //console.log(`${socket.user.username} sent a message: ${msg}`);
      // Handle the chat message
      //io.emit("chat message", { user: socket.user, message: msg });
    });

    console.log("En bruker koblet til:", socket.id);
   

//    socket.on("create", create(socket));
 //   socket.on("join", (data) => join(socket)(data));

 socket.on('create', (data) => create(socket)(data));
 socket.on('join', (data) => join(socket)(data));
 socket.on('disconnect',() => disconnect(socket)());
 socket.on('leave',(data) => leave(socket)(data));
 
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
  });
};
