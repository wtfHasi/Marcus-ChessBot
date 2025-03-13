export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = `${PieceColor}${PieceType}`;

export type Square = string;
export type Move = string;

export type GameStatus = 'setup' | 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export type Difficulty = 'beginner' | 'casual' | 'intermediate' | 'advanced' | 'expert';

export interface GameState {
  fen: string;
  playerColor: 'white' | 'black';
  status: GameStatus;
  history: Move[];
  isPlayerTurn: boolean;
  lastMove: Move | null;
  difficulty: Difficulty;
}