import { Router } from "express";
import { addToWatchlist, getWatchlistItem, removeFromWatchlist } from "../controllers/watchlist.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const watchlistRoutes = Router();

watchlistRoutes.route("/addToWatchlist").post(authMiddleware, addToWatchlist);
watchlistRoutes.route("/").get(getWatchlistItem);
watchlistRoutes.route("/:id").delete(authMiddleware, removeFromWatchlist);

// watchlistRoutes.route("/").get(authMiddleware, getWatchlist);

export default watchlistRoutes;