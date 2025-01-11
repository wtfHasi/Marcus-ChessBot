import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeMove } from "../api/api";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [botColor, setBotColor] = useState("b"); // Track bot color (Black by default)
  const [gameOver, setGameOver] = useState(false); // Track game over state

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
  }, [game]); // Re-run on game state change

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
        promotion: "q", // Automatically promote to queen
      });
  
      if (!move) {
        console.error(`Invalid move: ${sourceSquare} to ${targetSquare}`);
        return false;
      }
  
      console.log("Move made:", move);
  
      const lanMove = `${move.from}${move.to}${move.promotion ? move.promotion : ''}`;
      setFen(game.fen());
      localStorage.setItem("currentFEN", game.fen()); // Save the current FEN to localStorage
  
      try {
        const data = await makeMove(lanMove, game.fen());
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
  const restartGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    localStorage.removeItem("currentFEN"); // Clear saved FEN
    setGameOver(false);
    console.log("Game restarted");
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

