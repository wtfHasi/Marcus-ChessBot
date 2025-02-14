from stockfish import Stockfish

# Initialize Stockfis
path="../../stockfish/stockfish-windows-x86-64-avx2.exe"
stockfish = Stockfish(path)  # Update with your Stockfish path

# Function to set the position of the board (after each move)
def set_position(move):
    # Get the current FEN position
    current_position = stockfish.get_fen_position()
    print(f"Setting position. Current FEN: {current_position}")
    print(f"Applying move: {move}")
    
    try:
        # Apply the move from the current position
        stockfish.make_moves_from_current_position([move])
        
        # Get the new FEN after applying the move
        new_position = stockfish.get_fen_position()
        print(f"Position after move '{move}': {new_position}")
        
        return new_position  # Return the updated FEN
    except Exception as e:
        print(f"Error setting position: {e}")
        return current_position  # Return the original FEN if there's an error



# Function to get the best move from Stockfish
def get_best_move():
    # Get the current FEN position
    current_fen = stockfish.get_fen_position()
    
    # Log the current FEN to debug turn info
    print(f"Getting best move. Current FEN (turn info): {current_fen}")
    
    # Get the best move based on the current board state
    best_move = stockfish.get_best_move()
    
    # Log the bot's move
    print(f"Stockfish's best move: {best_move}")
    
    # Apply the bot's move to update the board position in Stockfish
    stockfish.make_moves_from_current_position([best_move])  # Apply the bot's move
    
    # Update the FEN after applying the move
    updated_fen = stockfish.get_fen_position()
    print(f"Updated FEN after bot's move: {updated_fen}")
    
    return best_move

