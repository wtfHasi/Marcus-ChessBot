import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GameSetupRequest {
  user_plays_white: boolean;
}

export interface GameSetupResponse {
  status: string;
  user_color: string;
  computer_first_move: string | null;
  fen: string;
}

export interface MoveRequest {
  move: string;
  user_plays_white: boolean;
}

export interface MoveResponse {
  status: string;
  game_status: string;
  bot_move: string;
  fen: string;
  recommended_delay?: number;
}

export const setupGame = async (request: GameSetupRequest): Promise<GameSetupResponse> => {
  const response = await api.post('/setup_game/', request);
  return response.data;
};

export const makeMove = async (move: string, userPlaysWhite: boolean): Promise<MoveResponse> => {
  const response = await api.post('/make_move/', { 
    move, 
    user_plays_white: userPlaysWhite 
  });
  console.log('API response:', response.data);
  return response.data;
};

export const resetGame = async (): Promise<{ status: string; starting_fen: string }> => {
  const response = await api.post('/reset_game/');
  return response.data;
};

// Difficulty presets which respects the backend presets
export const difficultyPresets = {
  beginner: { elo: 800, skill_level: 3, depth: 5, time: 1000 },
  casual: { elo: 1200, skill_level: 8, depth: 8, time: 1000 },
  intermediate: { elo: 1600, skill_level: 12, depth: 12, time: 1000 },
  advanced: { elo: 2000, skill_level: 16, depth: 15, time: 1000 },
  expert: { elo: 2500, skill_level: 20, depth: 18, time: 1000 },
};

export const setDifficulty = async (preset: keyof typeof difficultyPresets) => {
  const params = difficultyPresets[preset];
  const response = await api.post('/set_difficulty/', params);
  return response.data;
};