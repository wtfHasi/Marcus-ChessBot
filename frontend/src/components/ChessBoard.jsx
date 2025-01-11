import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeMove, resetGame } from "../api/api";
import "tailwindcss/tailwind.css"; // Ensure you have Tailwind CSS installed and configured
import "./chessboard.css"; // Adjust the path based on your project structure


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
      game.load(storedFEN);
      setFen(storedFEN);
    }
  }, [game]);

  // Handle game over
  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      alert("Game Over! The game has ended.");
    }
  }, [game]);

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
        const botMove = game.move(data.bot_move);
        if (botMove) {
          setFen(game.fen());
          localStorage.setItem("currentFEN", game.fen());
        } else {
          console.error(`Invalid bot move: ${data.bot_move}`);
        }
      } catch (error) {
        console.error("Failed to get bot move:", error);
      }
    }
  };

  // Handle bot's move
  const handleBotMove = async () => {
    try {
      const data = await makeMove("");
      const botMove = game.move(data.bot_move);
      if (botMove) {
        setFen(game.fen());
        localStorage.setItem("currentFEN", game.fen());
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
      alert("An error occurred. Please try again.");
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
          <div className="text-center">
            <h1 className="heading">Choose Your Color</h1>
            <select className="select" onChange={(e) => handleColorSelection(e.target.value)}>
              <option value="">Select a Color</option>
              <option value="w">White</option>
              <option value="b">Black</option>
            </select>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="heading">Marcus</h1>
            <button className="button" onClick={restartGame}>
              Restart
            </button>
            <div className="chessboard-container">
              <Chessboard
                position={fen}
                onPieceDrop={onPieceDrop}
                boardOrientation={playerColor === "w" ? "white" : "black"}
                boardWidth={400} // Keep the width manageable
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;