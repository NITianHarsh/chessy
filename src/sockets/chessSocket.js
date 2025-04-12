import { Chess } from "chess.js";

const chess = new Chess();
let players = {}; // Store player socket IDs
let currentPlayer = "w"; // White goes first

const chessSocketHandler = (io, socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  socket.on("makeMove", (move) => {
    const result = chess.move(move);
    if (result) {
      io.emit("updateBoard", chess.fen());
      currentPlayer = currentPlayer === "w" ? "b" : "w";
    } else {
      socket.emit("invalidMove", "Invalid move!");
    }
  });
};

export default chessSocketHandler;

// -> '   +------------------------+
//      8 | r  n  b  q  k  b  n  r |
//      7 | p  p  p  p  .  p  p  p |
//      6 | .  .  .  .  .  .  .  . |
//      5 | .  .  .  .  p  .  .  . |
//      4 | .  .  .  .  P  P  .  . |
//      3 | .  .  .  .  .  .  .  . |
//      2 | P  P  P  P  .  .  P  P |
//      1 | R  N  B  Q  K  B  N  R |
//        +------------------------+
//          a  b  c  d  e  f  g  h'
