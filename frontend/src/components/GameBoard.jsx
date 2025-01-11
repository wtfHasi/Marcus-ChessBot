import React from "react";
import { Chessboard } from "react-chessboard";

const GameBoard = ({ fen, onPieceDrop, playerColor }) => {
  return (
    <Chessboard
      position={fen}
      onPieceDrop={onPieceDrop}
      boardOrientation={playerColor === "w" ? "white" : "black"}
      boardWidth={600}
    />
  );
};

export default GameBoard;
