from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.stockfish import set_position, get_best_move

app = FastAPI()

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class MoveRequest(BaseModel):
    move: str

@app.post("/make_move/")
async def make_move(request: MoveRequest):
    user_move = request.move
    set_position(user_move)
    bot_move = get_best_move()
    return {"bot_move": bot_move}

