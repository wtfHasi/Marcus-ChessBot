import { create } from 'zustand';
import { GameState, Difficulty, Move } from '../types/chess';
import { setupGame, makeMove, resetGame, setDifficulty } from '../api/chessApi';

interface ChessGameStore extends GameState {
  startNewGame: (playAsWhite: boolean) => Promise<void>;
  resetCurrentGame: () => Promise<void>;
  changeDifficulty: (difficulty: Difficulty) => Promise<void>;
  makePlayerMove: (move: Move) => Promise<void>;
  
  setFen: (fen: string) => void;
  setStatus: (status: GameState['status']) => void;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Simple function to add a small random variation to make moves feel natural
const getRandomDelay = (baseDelay: number): number => {
  // Add ±20% randomness
  const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
  return Math.round(baseDelay * randomFactor);
};

export const useChessGame = create<ChessGameStore>((set, get) => ({
  // Initial state
  fen: INITIAL_FEN,
  playerColor: 'white',
  status: 'setup',
  history: [],
  isPlayerTurn: true,
  lastMove: null,
  difficulty: 'intermediate',

  // Setup actions
  startNewGame: async (playAsWhite: boolean) => {
    try {
      set({ status: 'setup' });
      const response = await setupGame({ user_plays_white: playAsWhite });
      
      if (response.status === 'success') {
        set({
          fen: response.fen,
          playerColor: response.user_color as 'white' | 'black',
          status: 'playing',
          history: [],
          isPlayerTurn: playAsWhite, // If playing as black, initially false
          lastMove: response.computer_first_move || null,
        });
        
        // If computer made a first move, add a small delay before updating
        if (response.computer_first_move) {
          const delay = getRandomDelay(1000);
          
          setTimeout(() => {
            set(state => ({ 
              history: [...state.history, response.computer_first_move!],
              isPlayerTurn: true // Enable player's turn after computer's first move
            }));
          }, delay);
        }
      }
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  },

  resetCurrentGame: async () => {
    try {
      const response = await resetGame();
      if (response.status === 'success') {
        set({
          fen: response.starting_fen,
          status: 'setup',
          history: [],
          isPlayerTurn: true,
          lastMove: null,
        });
      }
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  },

  changeDifficulty: async (difficulty: Difficulty) => {
    try {
      await setDifficulty(difficulty);
      set({ difficulty });
    } catch (error) {
      console.error('Error changing difficulty:', error);
    }
  },

  // Game actions
  makePlayerMove: async (move: Move) => {
    try {
      const { playerColor, history, isPlayerTurn } = get();
      const isPlayerWhite = playerColor === 'white';
  
      if (!isPlayerTurn) {
        console.warn(`Not your turn! Player is playing as ${playerColor}`);
        return;
      }
  
      const response = await makeMove(move, isPlayerWhite);
  
      if (response.status === 'success') {
        // Update the game state with the player's move
        const updatedHistory = [...history, move];
        
        set({
          fen: response.fen,
          history: updatedHistory,
          isPlayerTurn: false, 
          lastMove: move,
        });
  
        // Check if the game is over
        if (response.game_status === 'game_over') {
          set({ status: 'checkmate' });
          console.log('Game over detected!');
          return;
        }
  
        // Process the bot's response move with a consistent but slightly random delay
        if (response.bot_move) {
          // Use the recommended delay from the backend, or fall back to our default with randomness
          const baseDelay = response.recommended_delay || 1000;
          const delay = getRandomDelay(baseDelay);
          
          setTimeout(() => {
            set({
              fen: response.fen,
              history: [...updatedHistory, response.bot_move],
              isPlayerTurn: true,
              lastMove: response.bot_move,
            });
          }, delay);
        } else {
          set({ isPlayerTurn: true });
        }
      } else {
        // If the move was rejected, allow the player to try again
        set({ isPlayerTurn: true });
      }
    } catch (error) {
      console.error('API error:', error);
      set({ isPlayerTurn: true });
    }
  },
  
  // State setters
  setFen: (fen) => set({ fen }),
  setStatus: (status) => set({ status }),
  setIsPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn }),
}));