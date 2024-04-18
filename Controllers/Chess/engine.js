const { Chess } = require("chess.js");
const { modules } = require("../../Modells/eloRatingSchema");

class ChessEngine {
  chess = new Chess();

  constructor() {
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
    this.chess.reset();
    this.chess.load(fen);
    try {
      const move = this.chess.move({ from, to });
      if (move) {
        return [this.chess.fen(), move];
      }
    } catch (e) {
      return null;
    }
  };
}

module.exports = ChessEngine;
