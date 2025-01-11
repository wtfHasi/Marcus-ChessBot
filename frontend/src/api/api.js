import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
  timeout: 5000, // Set a timeout for requests
});

// Function to make a move
export const makeMove = async (move) => {
  try {
    const response = await API.post("/make_move/", { move });
    return response.data;
  } catch (error) {
    console.error("Error making move:", error);
    throw error; // Propagate the error for further handling
  }
};

// Function to reset the game
export const resetGame = async () => {
  try {
    const response = await API.post("/reset_game/");
    return response.data;
  } catch (error) {
    console.error("Error resetting the game:", error);
    throw error; // Propagate the error for further handling
  }
};