const socket = io();
const chess = new Chess();
const boardElement = document.getElementById("chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = colIndex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");

        pieceElement.innerHTML = getPieceUnicode(square);

        const isPlayerTurn = playerRole === square.color && chess.turn() === playerRole;
        pieceElement.draggable = isPlayerTurn;

        if (isPlayerTurn) pieceElement.classList.add("draggable");

        pieceElement.addEventListener("dragstart", (e) => {
          if (!isPlayerTurn) return;
          draggedPiece = pieceElement;
          sourceSquare = { row: rowIndex, col: colIndex };
          e.dataTransfer.setData("text/plain", "");
          pieceElement.classList.add("dragging");
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece.classList.remove("dragging");
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allows dropping
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedPiece || !sourceSquare) return;

        const targetSquare = {
          row: parseInt(squareElement.dataset.row),
          col: parseInt(squareElement.dataset.col),
        };

        handleMove(sourceSquare, targetSquare);
      });

      boardElement.appendChild(squareElement);
    });
  });

};

const handleMove = (sourceSquare, targetSquare) => {
  const move = {
    from: `${String.fromCharCode(97 + sourceSquare.col)}${8 - sourceSquare.row}`,
    to: `${String.fromCharCode(97 + targetSquare.col)}${8 - targetSquare.row}`,
    promotion: "q", // auto promote to queen
  };

  const result = chess.move(move);
  if (result) {
    socket.emit("makeMove", move); // Inform server
    renderBoard();
    if (chess.game_over()) {
      if (chess.isCheckmate()) alert("Checkmate!");
      else if (chess.isDraw()) alert("Draw!");
    }
  } else {
    alert("Invalid move!");
    renderBoard(); // Reset visuals
  }
};

const getPieceUnicode = (piece) => {
  const symbols = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  };
  if (piece.color === "w") {
    symbols.p = "♙";
    symbols.r = "♖";
    symbols.n = "♘";
    symbols.b = "♗";
    symbols.q = "♕";
    symbols.k = "♔";
  }
  return symbols[piece.type];
};

// Socket events
socket.on("playerRole", (role) => {
  playerRole = role;

  // Flip board for black player
  if (role === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }

  renderBoard(); // 👈 Initial render after assigning role
});


socket.on("updateBoard", (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on("makeMove", (move) => {
  chess.move(move);
  renderBoard();
});

socket.on("invalidMove", (msg) => alert(msg));
socket.on("gameFull", (msg) => alert(msg));

// Initial render fallback if socket event delays
renderBoard();
