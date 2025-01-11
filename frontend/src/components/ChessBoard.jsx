import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeMove, resetGame } from "../api/api";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [botColor, setBotColor] = useState("b");
  const [gameOver, setGameOver] = useState(false);

  // Load the saved FEN from localStorage on component mount
  useEffect(() => {
    const storedFEN = localStorage.getItem("currentFEN");
    if (storedFEN) {
      game.load(storedFEN);
      setFen(storedFEN);
    }
  }, [game]);

  useEffect(() => {
    if (game.isGameOver()) {
      setGameOver(true);
      console.log("Game Over");
      alert("Game Over! The game has ended.");
    }
  }, [game]);

  const onPieceDrop = async (sourceSquare, targetSquare) => {
    if (gameOver) {
      console.log("Game Over! Cannot make a move.");
      return false;
    }

    console.log("Attempting move:", sourceSquare + targetSquare);
    console.log("Current turn:", game.turn());

    if (game.turn() === "w") {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) {
        console.error(`Invalid move: ${sourceSquare} to ${targetSquare}`);
        return false;
      }

      console.log("Move made:", move);

      const lanMove = `${move.from}${move.to}${move.promotion ? move.promotion : ""}`;
      setFen(game.fen());
      localStorage.setItem("currentFEN", game.fen());

      try {
        const data = await makeMove(lanMove);
        console.log("Bot's move:", data.bot_move);

        if (game.turn() === "b") {
          const botMove = game.move(data.bot_move);
          if (botMove) {
            setFen(game.fen());
            localStorage.setItem("currentFEN", game.fen());
          } else {
            console.error(`Invalid bot move: ${data.bot_move}`);
          }
        }
      } catch (error) {
        console.error("Failed to make a move:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      console.log("It's not White's turn yet.");
    }

    if (game.isGameOver()) {
      setGameOver(true);
      alert("Game Over! The game has ended.");
    }

    return true;
  };

  // Function to restart the game
  const restartGame = async () => {
    try {
      const response = await resetGame(); // Call the reset API
      if (response.status === "success") {
        const newGame = new Chess(); // Reset frontend game state
        setGame(newGame);
        setFen(newGame.fen());
        localStorage.removeItem("currentFEN"); // Clear saved FEN
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
    <div>
      <h1>Chess Bot</h1>
      <button onClick={restartGame}>Restart Game</button>
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardWidth={600}
      />
    </div>
  );
};

export default ChessBoard;