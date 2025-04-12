import express from "express";
import { renderHomePage } from "../controllers/chess.controller.js";

const chessRouter = express.Router();

// Home route
chessRouter.get("/", renderHomePage);

export default chessRouter;
