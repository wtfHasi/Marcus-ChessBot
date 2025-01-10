# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from app.stockfish import set_position, get_best_move


app = FastAPI()

# Create a chess move request model
class MoveRequest(BaseModel):
    move: str

# Endpoint to get the bot's move
@app.post("/make_move/")
async def make_move(request: MoveRequest):
    user_move = request.move
    set_position(user_move)  # Use the function from stockfish.py
    bot_move = get_best_move()  # Use the function from stockfish.py
    return {"bot_move": bot_move}


