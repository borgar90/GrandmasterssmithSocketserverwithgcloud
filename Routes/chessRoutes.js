const express = require("express");
const router = express.Router();
const { Chess } = require("chess.js");
const ChessEngine = require("../Controllers/Chess/engine");
/**
 * @description Routes for chess
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const chess = new Chess();
const engine = new ChessEngine();

router.get("/new_game", async (req, res) => {
  chess.load(newGame());
  return res.status(200).send({ fen: chess.fen() });
});

router.get("/is_new_game", async (req, res) => {
  return res.status(200).send({ is_new_game: isNewGame(chess.fen()) });
});

router.get("/is_black_turn", async (req, res) => {
  return res.status(200).send({ is_black_turn: isBlackTurn(chess.fen()) });
});

router.get("/is_white_turn", async (req, res) => {
  return res.status(200).send({ is_white_turn: isWhiteTurn(chess.fen()) });
});

router.get("/is_check", async (req, res) => {
  return res.status(200).send({ is_check: isCheck(chess.fen()) });
});

router.get("/get_game_winner", async (req, res) => {
  return res.status(200).send({ game_winner: getGameWinner(chess.fen()) });
});

router.get("/is_game_over", async (req, res) => {
  return res.status(200).send({ is_game_over: isGameOver(chess.fen()) });
});

router.get("/is_moveable", async (req, res) => {
  const { from } = req.query;
  return res.status(200).send({ is_moveable: isMoveable(chess.fen(), from) });
});

router.post("/move", async (req, res) => {
  if (!req.body || !req.body.from || !req.body.to) {
    console.error("Invalid move data:", req.body);
    return res.status(400).json({ error: "Missing move data" });
  }
  console.log("Received body:", req.body);
  const { fen, from, to } = req.body;
  console.log("Making move from", from, "to", to);
  const result = engine.chessMove(fen, from, to);

  console.log("Move result:", result);
  if (result) {
    const fen = result;
    chess.load(fen);
    return res.status(200).send({ fen });
  } else {
    return res.status(400).send({ msg: "Invalid move" });
  }
});

router.get("/fen", async (req, res) => {
  return res.status(200).send({ fen: chess.fen() });
});

module.exports = router;
