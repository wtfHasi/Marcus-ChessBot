import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import ColorSelection from "./ColorSelection";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import { makeMove, resetGame } from "../api/api";

const ChessBoardWrapper = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState(localStorage.getItem("playerColor") || null);
  const [botColor, setBotColor] = useState(localStorage.getItem("botColor") || null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(!!localStorage.getItem("playerColor"));

  // Load saved FEN on mount
  useEffect(() => {
    const storedFEN = localStorage.getItem("currentFEN");
    if (storedFEN) {
      game.load(storedFEN);
      setFen(storedFEN);
    }
  }, [game]);

  // Game over handling
  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      alert("Game Over! The game has ended.");
    }
  }, [game]);

  // Save player/bot colors
  useEffect(() => {
    if (playerColor && botColor) {
      localStorage.setItem("playerColor", playerColor);
      localStorage.setItem("botColor", botColor);
    }
  }, [playerColor, botColor]);

  // Handle color selection
  const handleColorSelection = async (color) => {
    setPlayerColor(color);
    setBotColor(color === "w" ? "b" : "w");
    setGameStarted(true);

    if (color === "b") {
      await handleBotMove(); // Bot plays first
    }
  };

  // Handle bot's move
  const handleBotMove = async () => {
    try {
      const data = await makeMove("");
      console.log("Bot's move:", data.bot_move);
      console.log("Updated FEN after bot's move:", data.updated_fen);

      const botMove = game.move(data.bot_move);
      if (botMove) {
        setFen(data.updated_fen);
        localStorage.setItem("currentFEN", data.updated_fen);
      } else {
        console.error(`Invalid bot move: ${data.bot_move}`);
      }
    } catch (error) {
      console.error("Failed to get bot move:", error);
    }
  };

  // Handle piece drop
  const onPieceDrop = async (sourceSquare, targetSquare) => {
    if (gameOver) {
      console.log("Game Over! Cannot make a move.");
      return false;
    }

    if (game.turn() !== playerColor) {
      console.log("It's not your turn yet.");
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) {
      console.error(`Invalid move: ${sourceSquare} to ${targetSquare}`);
      return false;
    }

    setFen(game.fen());
    localStorage.setItem("currentFEN", game.fen());

    try {
      const lanMove = `${move.from}${move.to}${move.promotion || ""}`;
      const data = await makeMove(lanMove);
      console.log("Bot's move:", data.bot_move);

      const botMove = game.move(data.bot_move);
      if (botMove) {
        setFen(game.fen());
        localStorage.setItem("currentFEN", game.fen());
      } else {
        console.error(`Invalid bot move: ${data.bot_move}`);
      }
    } catch (error) {
      console.error("Failed to make a move:", error);
    }

    if (game.isGameOver()) {
      setGameOver(true);
      alert("Game Over! The game has ended.");
    }

    return true;
  };

  // Restart the game
  const restartGame = async () => {
    try {
      const response = await resetGame();
      if (response.status === "success") {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        localStorage.clear();
        setPlayerColor(null);
        setBotColor(null);
        setGameStarted(false);
        setGameOver(false);
        console.log("Game restarted successfully.");
      } else {
        console.error("Failed to reset game:", response.message);
      }
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  };

  return (
    <div>
      {!gameStarted ? (
        <ColorSelection onSelectColor={handleColorSelection} />
      ) : (
        <div>
          <h1>Chess Game</h1>
          <GameControls onRestart={restartGame} />
          <GameBoard fen={fen} onPieceDrop={onPieceDrop} playerColor={playerColor} />
        </div>
      )}
    </div>
  );
};

export default ChessBoardWrapper;
