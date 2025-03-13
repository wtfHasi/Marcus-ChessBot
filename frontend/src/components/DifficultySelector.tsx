import React from 'react';
import { useChessGame } from '../hooks/useChessGame';
import { Difficulty } from '../types/chess';

const difficultyLabels: Record<Difficulty, string> = {
  beginner: '👶 Beginner (ELO: 800)',
  casual: '😊 Casual (ELO: 1200)',
  intermediate: '🧠 Intermediate (ELO: 1600)',
  advanced: '🏆 Advanced (ELO: 2000)',
  expert: '🤖 Expert (ELO: 2500)'
};

export default function DifficultySelector() {
  const { difficulty, changeDifficulty, status } = useChessGame();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as Difficulty;
    changeDifficulty(newDifficulty);
  };

  return (
    <div className="mb-4">
      <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
        Engine Difficulty
      </label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={handleChange}
        disabled={status === 'playing'}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(difficultyLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {status === 'playing' && (
        <p className="text-sm text-gray-500 mt-1">
          Difficulty can only be changed before starting a new game.
        </p>
      )}
    </div>
  );
}