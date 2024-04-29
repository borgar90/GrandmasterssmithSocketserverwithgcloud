/**
 * @description Socket for å flytte brikker i sjakkspillet
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const move = (socket, io) => async (data) => {
  const { gameId, from, to } = data;
  const game = activeGames.get(gameId);
  if (game && game.makeMove(socket.user._id, from, to)) {
    const newFen = game.getFen(); // Assuming getFen() returns the current board state in FEN notation
    io.to(gameId).emit("move_made", { newFen }); // Broadcast the new board state to all players in the game
  } else {
    socket.emit("invalid_move", "Invalid move attempted");
  }
};

module.exports = move;
