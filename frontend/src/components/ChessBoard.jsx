import React, { useState } from "react";
import { Chess } from "chess.js"; // Import chess.js
import { Chessboard } from "react-chessboard";
import axios from "axios";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start"); // Initial FEN position

  const onDrop = async (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Promote to queen
    });

    if (!move) return false; // Invalid move

    setFen(game.fen()); // Update the board position

    // Send the user's move to the backend
    const response = await axios.post("http://127.0.0.1:8000/make_move/", {
      move: move.san,
    });

    // Apply the bot's move
    const botMove = response.data.bot_move;
    game.move(botMove);
    setFen(game.fen());

    return true; // Valid move
  };

  return (
    <div>
      <h1>Chess Bot</h1>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop} // Use onPieceDrop instead of onDrop
        boardWidth={600}
      />
    </div>
  );
};

export default ChessBoard;

