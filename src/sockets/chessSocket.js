import { Chess } from "chess.js";

const chess = new Chess();
let players = {};
let currentPlayer = "w";

const chessSocketHandler = (io, socket) => {
  console.log("A user connected:", socket.id);

  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
    console.log("White player assigned:", socket.id);
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
    console.log("Black player assigned:", socket.id);
  } else {
    socket.emit("gameFull", "Game is full. Please wait.");
    return;
  }

  socket.on("disconnect", () => {
    if (socket.id === players.white) {
      delete players.white;
      console.log("White player disconnected:", socket.id);
    } else if (socket.id === players.black) {
      delete players.black;
      console.log("Black player disconnected:", socket.id);
    }
  });

  socket.on("makeMove", (move) => {
    try {
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("makeMove", move);
        io.emit("updateBoard", chess.fen());

        // Optional: End game condition server-side (not strictly needed here)
        if (chess.game_over()) {
          console.log("Game Over");
        }
      } else {
        socket.emit("invalidMove", "Invalid move.");
      }
    } catch (error) {
      console.error("Error making move:", error);
      socket.emit("invalidMove", "Invalid move.");
    }
  });
};

export default chessSocketHandler;
