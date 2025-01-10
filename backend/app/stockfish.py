# stockfish.py
from stockfish import Stockfish

# Initialize Stockfish
stockfish = Stockfish(path="D:/stockfish/stockfish-windows-x86-64-avx2.exe")  # Update with your Stockfish path

# Function to set the position of the board
def set_position(move):
    stockfish.set_position([move])  # Stockfish expects a list of moves

# Function to get the best move from Stockfish
def get_best_move():
    return stockfish.get_best_move()

