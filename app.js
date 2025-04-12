import http from "http";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import chessRouter from "./src/routes/chess.route.js";
import chessSocketHandler from "./src/sockets/chessSocket.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // Full application is handled by express
const server = http.createServer(app); // create a server instance using http and link to express app
const io = new Server(server); // Initialize socket.io with the server instance

// Middleware and configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", chessRouter);

// Socket.io
io.on("connection", (socket) => chessSocketHandler(io, socket));

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
