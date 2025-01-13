import React from "react";
import { Chessboard } from "react-chessboard";

const ChessGame = ({ fen, onPieceDrop, playerColor, restartGame }) => (
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
);

export default ChessGame; // Make sure it's a default export

