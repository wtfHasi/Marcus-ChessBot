import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeMove } from "../api/api";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [botColor, setBotColor] = useState("b"); // Track bot color (Black by default)
  const [gameOver, setGameOver] = useState(false); // Track game over state

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
  
      // Construct the LAN format to send to the backend
      const lanMove = `${move.from}${move.to}${move.promotion ? move.promotion : ''}`;
      setFen(game.fen());
  
      try {
        const data = await makeMove(lanMove, game.fen()); // Send move in LAN format
        console.log("Bot's move:", data.bot_move);
  
        if (game.turn() === "b") {
          const botMove = game.move(data.bot_move);
          if (botMove) {
            setFen(game.fen());
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
  

  return (
    <div>
      <h1>Chess Bot</h1>
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop} // Correct prop name
        boardWidth={600}
      />
    </div>
  );
};

export default ChessBoard;
