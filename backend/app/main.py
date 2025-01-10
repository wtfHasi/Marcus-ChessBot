from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.stockfish import set_position, get_best_move

# FastAPI app initialization
app = FastAPI()

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow frontend URL (e.g., Vite)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods like GET, POST, OPTIONS
    allow_headers=["*"],  # Allow all headers
)

# Define your routes below
class MoveRequest(BaseModel):
    move: str

@app.post("/make_move/")
async def make_move(request: MoveRequest):
    user_move = request.move
    set_position(user_move)  # Call your backend logic
    bot_move = get_best_move()  # Get the bot's move
    return {"bot_move": bot_move}

