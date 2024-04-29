/**
 * @description Socket for å starte et sjakkspill
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const StartGame = (socket, io) => (data) => {
  const room = getRoom(data.roomId);
  const [player1, player2] = room.players;
  const gameId = startNewGame(player1, player2);
  socket.join(gameId); // Use a room per game for easy messaging
  io.to(gameId).emit("game_started", { gameId });
};

function startNewGame(player1, player2) {
  const newGame = new ChessGame(player1Id, player2Id);
  const gameId = `${player1Id}-${player2Id}`;
  activeGames.set(gameId, newGame); // Store the game with a unique ID
  return gameId;
}

function getGame(gameId) {
  return activeGames.get(gameId);
}

module.exports = { StartGame, getGame };
