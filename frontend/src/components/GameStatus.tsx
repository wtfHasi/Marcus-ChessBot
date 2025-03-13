import { useChessGame } from '../hooks/useChessGame';

export default function GameStatus() {
  const { status, isPlayerTurn, playerColor } = useChessGame();

  let statusText = '';
  let statusColor = 'text-gray-700';

  switch (status) {
    case 'setup':
      statusText = 'Choose your settings and start a new game';
      break;
    case 'playing':
      if (isPlayerTurn) {
        statusText = 'Your turn';
        statusColor = 'text-green-600 font-bold';
      } else {
        statusText = 'Computer is thinking...';
        statusColor = 'text-blue-600';
      }
      break;
    case 'check':
      statusText = isPlayerTurn ? 'You are in check!' : 'Computer is in check!';
      statusColor = 'text-orange-600 font-bold';
      break;
    case 'checkmate':
      statusText = isPlayerTurn ? 'Checkmate! You lost.' : 'Checkmate! You won!';
      statusColor = isPlayerTurn ? 'text-red-600 font-bold' : 'text-green-600 font-bold';
      break;
    case 'stalemate':
      statusText = 'Stalemate! Game ends in a draw.';
      statusColor = 'text-purple-600';
      break;
    case 'draw':
      statusText = 'Game ended in a draw.';
      statusColor = 'text-purple-600';
      break;
    default:
      statusText = 'Unknown game state';
  }

  return (
    <div className="p-3 bg-gray-100 rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">You play as: </span>
          <span className="capitalize">{playerColor}</span>
        </div>
        <div className={`${statusColor}`}>{statusText}</div>
      </div>
    </div>
  );
}