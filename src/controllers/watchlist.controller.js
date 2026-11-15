import { Movie } from "../models/movies.model.js";
import { WatchlistItem } from "../models/watchlist.model.js";

 const addToWatchlist = async (req, res) => {
    const { movieId, category, rating, notes } = req.body;
    const userId = req.user._id; // set by authMiddleware

    // verify movie exists
    const movie = await Movie.findById(movieId);

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    // check if movie is already in watchlist
    const existingInWatchlist = await WatchlistItem.findOne({
        userId: userId,
        movieId: movieId,
    });

    if (existingInWatchlist) {
        return res.status(400).json({ error: "Movie already exists in watchlist" });
    }

    const watchlistItem = await WatchlistItem.create({
        userId,
        movieId,
        movieTitle: movie.movieTitle,
        category: category || "Planned",
        rating,
        notes,
    });

    res.status(201).json({
        status: "Success",
        data: watchlistItem,
    });
};

const getWatchlistItem = async (req, res) => {
    try {
        const watchlistItems= await WatchlistItem.find().sort({ createdAt: -1 })

        res.status(200).json({
            message: "Movies fetched successfully",
            count: watchlistItems.length,
            watchlistItems
        })
    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

const removeFromWatchlist = async (req, res) => {
    try {
        const { id } = req.params
        const watchlistItem = await WatchlistItem.findByIdAndDelete(id)

        if (!watchlistItem) {
            return res.status(404).json({ message: "watchlist item not found" })
        }

        res.status(200).json({
            message: "watchlist item deleted successfully",
            watchlistItem
        })

    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

export {addToWatchlist, getWatchlistItem, removeFromWatchlist}