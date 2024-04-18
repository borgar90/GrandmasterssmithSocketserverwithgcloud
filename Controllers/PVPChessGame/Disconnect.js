const { rooms } = require("./Create");

const disconnect = (socket) => {
    return () => {
        console.log("A user disconnected:", socket.id);
        // Iterate through all rooms to find and remove the disconnected user
        Object.keys(rooms).forEach(roomName => {
            let wasInRoom = false;
            if (rooms[roomName].players.find(player => player.socketId === socket.id)) {
                rooms[roomName].players = rooms[roomName].players.filter(player => player.socketId !== socket.id);
                wasInRoom = true;
            }
            if (rooms[roomName].spectators.includes(socket.id)) {
                rooms[roomName].spectators = rooms[roomName].spectators.filter(spectator => spectator !== socket.id);
                wasInRoom = true;
            }

            if (wasInRoom) {
                socket.to(roomName).emit('player_disconnected', { player: socket.id });
                // Check if the room needs to be deleted
                if (rooms[roomName].players.length + rooms[roomName].spectators.length === 0) {
                    console.log(`Deleting room: ${roomName} as it's now empty.`);
                    delete rooms[roomName];
                }
            }
        });
    };
};
exports.disconnect = disconnect;