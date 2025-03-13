import { create } from 'zustand';
import { GameState, Difficulty, Move } from '../types/chess';
import { setupGame, makeMove, resetGame, setDifficulty } from '../api/chessApi';

interface ChessGameStore extends GameState {
  // Setup actions
  startNewGame: (playAsWhite: boolean) => Promise<void>;
  resetCurrentGame: () => Promise<void>;
  changeDifficulty: (difficulty: Difficulty) => Promise<void>;
  
  // Game actions
  makePlayerMove: (move: Move) => Promise<void>;
  
  // State setters
  setFen: (fen: string) => void;
  setStatus: (status: GameState['status']) => void;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
}

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

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
        
        // If computer made a first move, update the history and set player turn to true
        if (response.computer_first_move) {
          set(state => ({ 
            history: [...state.history, response.computer_first_move!],
            isPlayerTurn: true // Enable player's turn after computer's first move
          }));
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
  
      console.log(`Sending move to backend: ${move}, player is ${playerColor}`);
  
      const response = await makeMove(move, isPlayerWhite);
  
      if (response.status === 'success') {
        console.log(`Move succeeded. New FEN: ${response.fen}`);
        
        // Update the game state with the player's move
        const updatedHistory = [...history, move];
        
        set({
          fen: response.fen,
          history: updatedHistory,
          isPlayerTurn: false, // Wait for computer's response
          lastMove: move,
        });
  
        console.log(`[${playerColor}] Player moved: ${move}`);
  
        // Check if the game is over
        if (response.game_status === 'game_over') {
          set({ status: 'checkmate' });
          console.log('Game over detected!');
          return;
        }
  
        // Process the bot's response move
        if (response.bot_move) {
          console.log(`Bot responding with: ${response.bot_move}`);
          
          // Short delay for visual feedback
          setTimeout(() => {
            set({
              fen: response.fen,
              history: [...updatedHistory, response.bot_move],
              isPlayerTurn: true, // Now it's player's turn again
              lastMove: response.bot_move,
            });
  
            console.log(`[Opponent] Bot moved: ${response.bot_move}`);
          }, 300);
        } else {
          set({ isPlayerTurn: true });
        }
      } else {
        // Handle the error from the backend
        console.error('Move failed:', response);
        
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