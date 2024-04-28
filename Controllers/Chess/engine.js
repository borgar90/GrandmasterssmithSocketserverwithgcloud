const { Chess, validateFen } = require("chess.js");

class ChessEngine {
  chess = null;

  constructor() {
    this.chess = new Chess();
    this.chess.load(this.newGame());
  }

  newGame = () => "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  isNewGame = (fen) => fen === this.newGame();

  isBlackTurn = (fen) => {
    this.chess.reset();
    this.chess.load(fen);
    return this.chess.turn() === "b";
  };

  isWhiteTurn = (fen) => {
    this.chess.reset();
    this.chess.load(fen);
    return this.chess.turn() === "w";
  };

  isCheck = (fen) => {
    this.chess.reset();
    this.chess.load(fen);
    return this.chess.inCheck();
  };

  getGameWinner = (fen) => {
    this.chess.reset();
    this.chess.load(fen);
    if (this.chess?.isCheckmate()) {
      return this.chess.turn() === "w" ? "b" : "w";
    }
    return null;
  };

  isGameOver = (fen) => {
    this.chess.reset();
    this.chess.load(fen);
    return this.chess.isGameOver();
  };

  isMoveable = (fen, from) => {
    this.chess.reset();
    this.chess.load(fen);
    return this.chess.moves({ square: from }).length > 0;
  };

  chessMove = (fen, from, to) => {
    const tempChess = new Chess();
    tempChess.load(fen);
    console.log("chessMove", tempChess.fen());
    try {
      const move = tempChess.move({ from, to, promotion: "q" });
      console.log("chessMove move", move.after);
      if (move) {
        return move.after;
      }
    } catch (e) {
      return null;
    }
  };
}

module.exports = ChessEngine;
