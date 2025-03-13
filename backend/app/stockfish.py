import os
from dotenv import load_dotenv
from stockfish import Stockfish

load_dotenv()
path = os.getenv("STOCKFISH_PATH")
stockfish = Stockfish(path)

# Function to set the position of the board (after each move)
def set_position(move=None):
    """Update the board position with a new move"""
    try:
        if move:
            print(f"Making move: {move}")
            # The stockfish.make_moves_from_current_position can return None for valid moves
            # We'll rely on is_move_legal check instead
            result = stockfish.make_moves_from_current_position([move])
            
            # Just log the result but don't use it to determine success
            print(f"Move result: {result}")
            
            # Check if the board position changed as confirmation
            new_position = stockfish.get_fen_position()
            print(f"New position: {new_position}")
            
            # If we got here without exceptions, consider it a success
            return True
        return True
    except Exception as e:
        print(f"Error making move: {e}")
        return False

# Function to get the best move from Stockfish
def get_best_move():
    current_fen = stockfish.get_fen_position()
    print(f"Getting best move. Current FEN (turn info): {current_fen}")
    best_move = stockfish.get_best_move()
    print(f"Stockfish's best move: {best_move}")
    
    if best_move:
        try:
            stockfish.make_moves_from_current_position([best_move])
            updated_fen = stockfish.get_fen_position()
            print(f"Updated FEN after bot's move: {updated_fen}")
            return best_move
        except Exception as e:
            print(f"Error making bot move: {e}")
            return None
    return None

def is_move_legal(move):
    """Check if a move is legal in the current position"""
    try:
        # Print current board for debugging
        print(f"Current position: {stockfish.get_fen_position()}")
        print(f"Checking if move is legal: {move}")
        
        # Get all legal moves
        legal_moves = stockfish.get_top_moves(100)
        legal_move_uci = [m["Move"] for m in legal_moves]
        
        print(f"Legal moves: {legal_move_uci}")
        
        # Check if the move is in the list of legal moves
        is_legal = move in legal_move_uci
        print(f"Move {move} is {'legal' if is_legal else 'illegal'}")
        return is_legal
    except Exception as e:
        print(f"Error checking move legality: {e}")
        return False

def is_game_over():
    """
    Check if the game is over (checkmate, stalemate, etc.)
    Returns True if game is over, False otherwise
    """
    try:
        # If there are no legal moves, the game is over
        legal_moves = stockfish.get_top_moves(1)
        
        # If no legal moves are available, the game is over
        if not legal_moves:
            print("Game over: No legal moves available")
            return True
            
        # Get the current FEN to analyze the position
        fen = stockfish.get_fen_position()
        print(f"Checking game status for position: {fen}")
        
        # Check for insufficient material (K vs K, K+B vs K, K+N vs K)
        # This is a simple check and might need enhancement for all edge cases
        pieces = fen.split(' ')[0]
        pieces = ''.join(c for c in pieces if c.isalpha())
        
        # If only kings remain or king+minor piece vs king
        if (len(pieces) <= 3 and 
            pieces.count('k') + pieces.count('K') == 2 and
            pieces.count('b') + pieces.count('B') + pieces.count('n') + pieces.count('N') <= 1):
            print("Game over: Insufficient material")
            return True
            
        # Check for 50-move rule and threefold repetition would require position history
        # For now, we're only checking if there are legal moves
        
        return False
    except Exception as e:
        print(f"Error checking if game is over: {e}")
        # Default to false if there's an error
        return False

# Set the difficulty of the Stockfish engine
def set_difficulty(elo=None, skill_level=None, depth=None, time=None):
    """
    Set the difficulty of the Stockfish engine
    """
    try:
        if elo is not None:
            stockfish.set_elo_rating(elo)
        if skill_level is not None:
            stockfish.set_skill_level(skill_level)
        if depth is not None:
            stockfish.set_depth(depth)
        if time is not None:
            stockfish.set_option("Move Time", time)
        
        print(f"Difficulty set: ELO={elo}, Skill Level={skill_level}, Depth={depth}, Time={time}")
        return True
    except Exception as e:
        print(f"Error setting difficulty: {e}")
        return False

def get_difficulty_presets():
    return {
        "beginner": {"elo": 800, "skill_level": 3, "depth": 5},
        "casual": {"elo": 1200, "skill_level": 8, "depth": 8},
        "intermediate": {"elo": 1600, "skill_level": 12, "depth": 12},
        "advanced": {"elo": 2000, "skill_level": 16, "depth": 15},
        "expert": {"elo": 2500, "skill_level": 20, "depth": 18}
    }