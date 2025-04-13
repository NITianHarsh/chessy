# Chessy - Real-Time Multiplayer Chess Game

Chessy is a real-time multiplayer chess game built using **Node.js**, **Socket.io**, and **Chess.js**. It allows two players to play chess in real-time with drag-and-drop functionality for moving pieces. Spectators can also watch the game live. The game enforces chess rules and updates the board state dynamically for all connected clients.

## Features

- **Real-Time Gameplay**: Players can make moves in real-time, and the board updates instantly for both players and spectators.
- **Drag-and-Drop Interface**: Intuitive drag-and-drop functionality for moving chess pieces.
- **Chess Rules Enforcement**: The game validates moves using the `Chess.js` library.
- **Player Roles**: Players are assigned roles (White or Black) dynamically, and additional users are designated as spectators.
- **Responsive Design**: The chessboard is styled using Tailwind CSS and is responsive across devices.

---

## How It Works

### Backend

1. **Server Setup**:

   - The server is built using **Express.js** and serves static files from the `public/` directory.
   - The `Socket.io` library is used for real-time communication between the server and clients.

2. **Socket.io Logic**:

   - Players are assigned roles (`White` or `Black`) when they connect.
   - Moves are validated using the `Chess.js` library, and the board state is updated for all connected clients.
   - Spectators can watch the game but cannot make moves.

3. **Chess Rules**:
   - The `Chess.js` library enforces chess rules, validates moves, and checks for game-ending conditions (e.g., checkmate, stalemate).

### Frontend

1. **Chessboard Rendering**:

   - The chessboard is rendered dynamically using JavaScript and styled with Tailwind CSS.
   - Drag-and-drop functionality is implemented for moving pieces.

2. **Socket.io Events**:

   - The client listens for events like `playerRole`, `updateBoard`, and `makeMove` to update the UI in real-time.

3. **Move Validation**:
   - Moves are validated on the server, and invalid moves are rejected with an alert.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chessy.git
   cd chessy
   ```
2. Install dependencies:
   npm install
3. Start the server:
   npm start
4. Open your browser and navigate to:
   http://localhost:4000
