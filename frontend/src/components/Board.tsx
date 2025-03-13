import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessGame } from '../hooks/useChessGame';
import { Chess } from 'chess.js';

export default function Board() {
  const { 
    fen, 
    playerColor, 
    isPlayerTurn, 
    makePlayerMove, 
    status,
    lastMove,
    setFen
  } = useChessGame();
  
  const [chess, setChess] = useState(new Chess(fen));
  
  // Update chess instance when FEN changes from store
  useEffect(() => {
    try {
      setChess(new Chess(fen));
    } catch (e) {
      console.error('Invalid FEN:', e);
    }
  }, [fen]);

  // Handle piece drop by the player
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!isPlayerTurn || status !== 'playing') {
      return false;
    }
    try {
      const moveObj = {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      };
      const result = chess.move(moveObj);
      
      if (result) {
        const uciMove = sourceSquare + targetSquare;
        // Update the FEN in the store immediately for visual feedback
        const newFen = chess.fen();
        setFen(newFen);
        makePlayerMove(uciMove);
        return true;
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }  
    return false;
  };

  // Customize board orientation based on player color
  const boardOrientation = playerColor === 'white' ? 'white' : 'black';

  // Highlight last move
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (typeof lastMove === "string") {
    const from = lastMove.substring(0, 2);
    const to = lastMove.substring(2, 4);

    customSquareStyles[from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    customSquareStyles[to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Chessboard
        id="main-board"
        position={chess.fen()}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        customSquareStyles={customSquareStyles}
        areArrowsAllowed={true}
        boardWidth={560}
      />
      {status !== 'playing' && status !== 'setup' && (
        <div className="mt-4 p-2 bg-gray-200 text-center rounded">
          Game status: {status.toUpperCase()}
        </div>
      )}
      {!isPlayerTurn && status === 'playing' && (
        <div className="mt-4 p-2 bg-yellow-100 text-center rounded">
          Computer is thinking...
        </div>
      )}
    </div>
  );
}