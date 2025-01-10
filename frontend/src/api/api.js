import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
  timeout: 5000, // Set a timeout for requests
});

export const makeMove = async (move) => {
  try {
    const response = await API.post("/make_move/", { move });
    return response.data;
  } catch (error) {
    console.error("Error making move:", error);
    throw error; // Propagate the error for further handling
  }
};

