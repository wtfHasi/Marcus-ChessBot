import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';
import Controls from './components/Controls';
import GameStatus from './components/GameStatus';
import MoveHistory from './components/MoveHistory';
import './assets/styles/index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Chess App</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar with controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
              <DifficultySelector />
              <Controls />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <MoveHistory />
            </div>
          </div>

          {/* Chess board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <GameStatus />
              <div className="mt-4">
                <Board />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>Chess App with Stockfish Engine</p>
        </div>
      </footer>
    </div>
  );
}