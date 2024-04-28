const { Chess, validateFen } = require("chess.js");
const ChessEngine = require("./engine");

class ChessGame {
  chess = new Chess();
  fen = ChessEngine.newGame();

  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = this.initializeBoard();
    this.currentTurn = player1;
  }

  initializeBoard() {
    this.chess;
    this.chess.load(ChessEngine.newGame());
  }

  makeMove(player, fromPos, toPos) {
    if (
      (ChessEngine.isisWhiteTurn() && player.color === "black") ||
      (ChessEngine.isBlackTurn() && player.color === "white")
    ) {
      throw new Error("Not your turn");
    }
    if (!checkForCheckmate()) return;
    const move = this.chess.move({ from: fromPos, to: toPos, promote: "q" });
    if (move) {
      this.setFen(this.chess.fen());
    }
  }

  setFen(fen) {
    this.fen = fen;
    this.chess.load(fen);
  }

  getFen() {
    return this.fen;
  }

  getPug() {
    return this.chess.pug();
  }

  checkForCheckmate() {
    return this.chess.isCheckmate();
  }
}
