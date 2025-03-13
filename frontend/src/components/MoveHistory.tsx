import React from 'react';
import { useChessGame } from '../hooks/useChessGame';

export default function MoveHistory() {
  const { history } = useChessGame();
  const historyRef = React.useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when history updates
  React.useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Function to format moves in algebraic notation
  const formatMove = (move: string): string => {
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    return `${from}->${to}`;
  };

  return (
    <div className="move-history">
      <div className="move-history-header">Move History</div>
      <div ref={historyRef} className="move-history-content">
        {history.length > 0 ? (
          <div>
            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, index) => {
              const moveNum = index + 1;
              const whiteIdx = index * 2;
              const blackIdx = whiteIdx + 1;
              const whiteMove = history[whiteIdx];
              const blackMove = history[blackIdx];
              
              return (
                <div key={moveNum} className="move-row">
                  <span className="move-number">{moveNum}.</span>
                  <span className="move-white">{formatMove(whiteMove)}</span>
                  <span className="move-black">
                    {blackMove ? formatMove(blackMove) : ''}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
}