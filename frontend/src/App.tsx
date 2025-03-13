import Board from './components/Board';
import Controls from './components/Controls';
import DifficultySelector from './components/DifficultySelector';
import GameStatus from './components/GameStatus';
import MoveHistory from './components/MoveHistory';

export default function ChessGame() {
  return (
    <div className="chess-app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Game Settings Section */}
        <div className="sidebar-section">
          <h2 className="sidebar-section-title">Game Settings</h2>
          <div className="game-controls">
            <DifficultySelector />
            <Controls />
          </div>
        </div>
        
        {/* Move History Section */}
        <div className="sidebar-section">
          <h2 className="sidebar-section-title">Move History</h2>
          <MoveHistory />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <h1 className="text-2xl font-bold mb-6 text-center">Chess Game</h1>
        
        {/* Game Status */}
        <GameStatus />
        
        {/* Chessboard */}
        <div className="board-container mt-4">
          <Board />
        </div>
      </div>
    </div>
  );
}