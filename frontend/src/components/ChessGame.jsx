import React from "react";
import { Chessboard } from "react-chessboard";

const ChessGame = ({ fen, onPieceDrop, playerColor, restartGame, isLoading }) => (
  <div className="text-center">
    <h1 className="heading">Marcus</h1>
    <button className="button" onClick={restartGame} disabled={isLoading}>
      {isLoading ? "Loading..." : "Restart"}
    </button>
    <div className="chessboard-container">
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardOrientation={playerColor === "w" ? "white" : "black"}
        boardWidth={400}
        areArrowsAllowed={false}
        animationDuration={300}
        customDarkSquareStyle={{ backgroundColor: "#769656" }}
        customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
      />
    </div>
    {isLoading && (
      <div className="mt-2 text-gray-600">
        Processing move...
      </div>
    )}
  </div>
);

export default ChessGame;