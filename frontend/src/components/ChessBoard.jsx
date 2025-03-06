import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { makeMove, resetGame } from "../api/api";
import ColorSelection from "./ColorSelection";
import ChessGame from "./ChessGame";
import "tailwindcss/tailwind.css";
import "./chessboard.css";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState(localStorage.getItem("playerColor") || null);
  const [botColor, setBotColor] = useState(localStorage.getItem("botColor") || null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(!!localStorage.getItem("playerColor"));

  // Load the saved FEN from localStorage on component mount
  useEffect(() => {
    const storedFEN = localStorage.getItem("currentFEN");
    if (storedFEN) {
      const newGame = new Chess(storedFEN);
      setGame(newGame);
      setFen(storedFEN);
    }
  }, []);

  // Handle game over
  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      alert("Game Over! The game has ended.");
    }
  }, [game, fen]);

  // Save player and bot colors in localStorage when selected
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
      try {
        const data = await makeMove("");
        const newGame = new Chess();
        const botMove = newGame.move(data.bot_move);
        if (botMove) {
          setGame(newGame);
          setFen(newGame.fen());
          localStorage.setItem("currentFEN", newGame.fen());
        } else {
          console.error(`Invalid bot move: ${data.bot_move}`);
        }
      } catch (error) {
        console.error("Failed to get bot move:", error);
      }
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

    // Create a new game instance to avoid mutation issues
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) {
      console.error(`Invalid move: ${sourceSquare} to ${targetSquare}`);
      return false;
    }

    setGame(newGame);
    setFen(newGame.fen());
    localStorage.setItem("currentFEN", newGame.fen());

    try {
      const lanMove = `${move.from}${move.to}${move.promotion || ""}`;
      const data = await makeMove(lanMove);
      console.log("Bot's move:", data.bot_move);

      // Create another new game instance for the bot's move
      const botMoveGame = new Chess(newGame.fen());
      const botMove = botMoveGame.move(data.bot_move);
      if (botMove) {
        setGame(botMoveGame);
        setFen(botMoveGame.fen());
        localStorage.setItem("currentFEN", botMoveGame.fen());
      } else {
        console.error(`Invalid bot move: ${data.bot_move}`);
      }
    } catch (error) {
      console.error("Failed to make a move:", error);
      alert("An error occurred. Please try again.");
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
        localStorage.removeItem("currentFEN");
        localStorage.removeItem("playerColor");
        localStorage.removeItem("botColor");
        setPlayerColor(null);
        setBotColor(null);
        setGameStarted(false);
        setGameOver(false);
        console.log("Game restarted successfully. Backend reset to:", response.starting_fen);
      } else {
        console.error("Failed to reset game:", response.message);
        alert("An error occurred while resetting the game.");
      }
    } catch (error) {
      console.error("Error resetting the game:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <div className="content">
        {!gameStarted ? (
          <ColorSelection handleColorSelection={handleColorSelection} />
        ) : (
          <ChessGame
            fen={fen}
            onPieceDrop={onPieceDrop}
            playerColor={playerColor}
            restartGame={restartGame}
          />
        )}
      </div>
    </div>
  );
};

export default ChessBoard;