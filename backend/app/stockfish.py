import os
from dotenv import load_dotenv
from stockfish import Stockfish

load_dotenv()
path= os.getenv("STOCKFISH_PATH")
stockfish = Stockfish(path)

# Function to set the position of the board (after each move)
def set_position(move):
    current_position = stockfish.get_fen_position()
    print(f"Setting position. Current FEN: {current_position}")
    print(f"Applying move: {move}")
    try:
        stockfish.make_moves_from_current_position([move])
        new_position = stockfish.get_fen_position()
        print(f"Position after move '{move}': {new_position}")
        return new_position
    except Exception as e:
        print(f"Error setting position: {e}")
        return current_position

# Function to get the best move from Stockfish
def get_best_move():
    current_fen = stockfish.get_fen_position()
    print(f"Getting best move. Current FEN (turn info): {current_fen}")
    best_move = stockfish.get_best_move()
    print(f"Stockfish's best move: {best_move}")
    stockfish.make_moves_from_current_position([best_move])
    updated_fen = stockfish.get_fen_position()
    print(f"Updated FEN after bot's move: {updated_fen}")
    return best_move