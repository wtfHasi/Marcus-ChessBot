import os
from dotenv import load_dotenv
from stockfish import Stockfish

load_dotenv()
path = os.getenv("STOCKFISH_PATH")
stockfish = Stockfish(path)

# Function to set the position of the board (after each move)
def set_position(move=None):
    try:
        if move:
            result = stockfish.make_moves_from_current_position([move])
            new_position = stockfish.get_fen_position()
            return True
        return True
    except Exception as e:
        print(f"Error making move: {e}")
        return False

# Function to get the best move from Stockfish
def get_best_move():
    current_fen = stockfish.get_fen_position()
    best_move = stockfish.get_best_move() 
    if best_move:
        try:
            stockfish.make_moves_from_current_position([best_move])
            updated_fen = stockfish.get_fen_position()
            return best_move
        except Exception as e:
            print(f"Error making bot move: {e}")
            return None
    return None

def is_move_legal(move):
    try:
        # Get all legal moves and checks whether the move is actually legal
        legal_moves = stockfish.get_top_moves(100)
        legal_move_uci = [m["Move"] for m in legal_moves]
        is_legal = move in legal_move_uci
        return is_legal
    except Exception as e:
        print(f"Error checking move legality: {e}")
        return False

def is_game_over():
    try:
        legal_moves = stockfish.get_top_moves(1)
        # If no legal moves are available, CheckMate
        if not legal_moves:
            return True
            
        # Get the current FEN to analyze the position
        fen = stockfish.get_fen_position()
        pieces = fen.split(' ')[0]
        pieces = ''.join(c for c in pieces if c.isalpha())
        
        # If only kings remain or king+minor piece vs king(Insufficient Material)
        if (len(pieces) <= 3 and 
            pieces.count('k') + pieces.count('K') == 2 and
            pieces.count('b') + pieces.count('B') + pieces.count('n') + pieces.count('N') <= 1):
            return True
        
        return False
    except Exception as e:
        print(f"Error checking if game is over: {e}")
        return False

# Set the difficulty of the Stockfish engine
def set_difficulty(elo=None, skill_level=None, depth=None, time=None):
    try:
        if elo is not None:
            stockfish.set_elo_rating(elo)
        if skill_level is not None:
            stockfish.set_skill_level(skill_level)
        if depth is not None:
            stockfish.set_depth(depth)
        if time is not None:
            stockfish.set_option("Move Time", time)
        return True
    except Exception as e:
        print(f"Error setting difficulty: {e}")
        return False

def get_difficulty_presets():
    return {
        "beginner": {"elo": 800, "skill_level": 3, "depth": 5, "time":2000},
        "casual": {"elo": 1200, "skill_level": 8, "depth": 8},
        "intermediate": {"elo": 1600, "skill_level": 12, "depth": 12},
        "advanced": {"elo": 2000, "skill_level": 16, "depth": 15},
        "expert": {"elo": 2500, "skill_level": 20, "depth": 18}
    }