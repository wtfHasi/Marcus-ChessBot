import React from 'react';
import { useChessGame } from '../hooks/useChessGame';

export default function MoveHistory() {
  const { history, playerColor } = useChessGame();
  const historyRef = React.useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when history updates
  React.useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Function to format moves in algebraic notation
  const formatMove = (move: string): string => {
    // This is a simplified converter - chess.js has more robust conversion
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    return `${from}->${to}`;
  };

  // Group moves by pairs (white's move and black's response)
  const moveRows = [];
  for (let i = 0; i < history.length; i += 2) {
    const whiteMove = history[i];
    const blackMove = history[i + 1];
    
    moveRows.push(
      <div key={i} className="grid grid-cols-2 gap-2 py-1 border-b border-gray-200">
        <div className="text-sm">{i/2 + 1}. {formatMove(whiteMove)}</div>
        <div className="text-sm">{blackMove ? formatMove(blackMove) : ''}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 font-medium">Move History</div>
      <div 
        ref={historyRef} 
        className="p-2 max-h-60 overflow-y-auto bg-white"
      >
        <div className="grid grid-cols-2 gap-2 py-1 border-b border-gray-200 font-medium">
          <div>White</div>
          <div>Black</div>
        </div>
        {moveRows.length > 0 ? moveRows : (
          <div className="text-gray-500 text-center py-4">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
}