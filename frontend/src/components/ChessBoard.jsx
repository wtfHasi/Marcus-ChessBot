import React, { useState } from "react";
import { Chess } from "chess.js"; // Import chess.js
import { Chessboard } from "react-chessboard";
import { makeMove } from "../api/api"; // Import the API function

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start"); // Initial FEN position

  const onPieceDrop = async (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Promote to queen
    });

    if (!move) return false; // Invalid move

    setFen(game.fen()); // Update the board position

    try {
      // Send the user's move to the backend and get the bot's move
      const data = await makeMove(move.san);

      // Apply the bot's move
      game.move(data.bot_move);
      setFen(game.fen());
    } catch (error) {
      console.error("Failed to make a move:", error);
      alert("An error occurred. Please try again.");
    }

    return true; // Valid move
  };

  return (
    <div>
      <h1>Chess Bot</h1>
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop} // Corrected prop name
        boardWidth={600}
      />
    </div>
  );
};

export default ChessBoard;


