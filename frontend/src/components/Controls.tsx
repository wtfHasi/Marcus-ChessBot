import React from 'react';
import { useChessGame } from '../hooks/useChessGame';

export default function Controls() {
  const { status, startNewGame, resetCurrentGame } = useChessGame();
  const [selectedColor, setSelectedColor] = React.useState<'white' | 'black'>('white');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value as 'white' | 'black');
  };

  const handleStartGame = () => {
    startNewGame(selectedColor === 'white');
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-medium">Play as:</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="color"
              value="white"
              checked={selectedColor === 'white'}
              onChange={handleColorChange}
              disabled={status === 'playing'}
              className="h-4 w-4"
            />
            <span>White</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="color"
              value="black"
              checked={selectedColor === 'black'}
              onChange={handleColorChange}
              disabled={status === 'playing'}
              className="h-4 w-4"
            />
            <span>Black</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-2">
        {status === 'setup' || status === 'checkmate' || status === 'stalemate' || status === 'draw' ? (
          <button
            onClick={handleStartGame}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Start New Game
          </button>
        ) : (
          <button
            onClick={resetCurrentGame}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Resign Game
          </button>
        )}
      </div>
    </div>
  );
}