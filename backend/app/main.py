import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.stockfish import set_position, get_best_move, is_move_legal, set_difficulty, get_difficulty_presets, is_game_over, stockfish

app = FastAPI()
load_dotenv()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class GameSetupRequest(BaseModel):
    user_plays_white: bool

@app.post("/setup_game/")
async def setup_game(request: GameSetupRequest):
    try:
        stockfish.set_position([])  
        user_color = "white" if request.user_plays_white else "black"
        
        # If user plays black, computer makes first move
        first_move = None
        computer_fen = None
        
        if not request.user_plays_white:
            first_move = get_best_move()
            if not first_move:
                return {"status": "error", "message": "Failed to calculate computer's first move"}
            
            computer_fen = stockfish.get_fen_position()
        else:
            computer_fen = stockfish.get_fen_position()
            
        return {
            "status": "success", 
            "user_color": user_color,
            "computer_first_move": first_move,
            "fen": computer_fen
        }
    except Exception as e:
        print(f"Error in setup_game: {e}")
        return {"status": "error", "message": str(e)}


class MoveRequest(BaseModel):
    move: str
    user_plays_white: bool = True 

@app.post("/make_move/")
async def make_move(request: MoveRequest):
    try:
        user_move = request.move
        user_plays_white = request.user_plays_white 
        if not is_move_legal(user_move):
            return {"status": "error", "message": "Illegal move"}
        success = set_position(user_move)
        if not success:
            return {"status": "error", "message": "Failed to make move"}
        
        user_move_fen = stockfish.get_fen_position()
        if is_game_over():
            return {
                "status": "success",
                "game_status": "game_over",
                "fen": user_move_fen,
                "message": "Game over after your move"
            }
        
        # Get bot's move immediately (no delay here)
        bot_move = get_best_move()
        if not bot_move:
            return {"status": "error", "message": "Failed to calculate bot move"}
        
        game_status = "game_over" if is_game_over() else "ongoing"
        current_fen = stockfish.get_fen_position()
        
        # Adds a flag to indicate that the frontend should delay showing the bot's move
        # We calculate the recommended delay based on difficulty
        difficulty_presets = get_difficulty_presets()
        current_difficulty = difficulty_presets.get(os.getenv("CURRENT_DIFFICULTY", "intermediate"), 
                                                 difficulty_presets["intermediate"])
        recommended_delay = current_difficulty.get("time", 1000)  # In milliseconds
        
        return {
            "status": "success",
            "game_status": game_status,
            "bot_move": bot_move,
            "fen": current_fen,
            "recommended_delay": recommended_delay
        }
    except Exception as e:
        print(f"Error processing move: {e}")
        return {"status": "error", "message": str(e)}
@app.post("/reset_game/")
async def reset_game():
    try:
        stockfish.set_position([])
        starting_fen = stockfish.get_fen_position()
        return {"status": "success", "starting_fen": starting_fen}
    except Exception as e:
        print(f"Error resetting Stockfish: {e}")
        return {"status": "error", "message": str(e)}
    
class DifficultyRequest(BaseModel):
    elo: int = None
    skill_level: int = None
    depth: int = None
    time: int = None

@app.post("/set_difficulty/")
async def set_game_difficulty(request: DifficultyRequest):
    try:
        success = set_difficulty(
            elo=request.elo,
            skill_level=request.skill_level,
            depth=request.depth,
            time=request.time
        )
        if success:
            return {"status": "success", "message": "Difficulty set successfully"}
        else:
            return {"status": "error", "message": "Failed to set difficulty"}
    except Exception as e:
        return {"status": "error", "message": str(e)}