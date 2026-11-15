import mongoose from "mongoose";
import { Movie } from "../models/movies.model.js";

const addMovie = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        // Destructure using the correct field names that match the schema
        const { movieTitle, movieId, rating, notes, category } = req.body;

        if (!movieTitle || !rating || !category) {
            return res.status(400).json({ message: "movieTitle, rating, and category are required" });
        }

        const existingMovie = await Movie.findOne({ movieTitle })
        if (existingMovie) {
            const error = new Error("Movie already exists")
            error.statusCode = 409
            throw error
        }

        // NOTE: userId should come from req.user._id once auth middleware is added
        // For now we show the structure clearly
        const newMovie = await Movie.create([{
            movieTitle,
            movieId,        // optional external ID (e.g. from TMDB)
            rating,
            notes,          // optional
            category: category || "Planned",   // enum: Planned, Watching, Completed, Dropped
            // userId: req.user._id   ← uncomment once auth middleware is in place
        }], { session })

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            message: "Movie added successfully",
            movie: newMovie[0]
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(error.statusCode || 500).json({ message: "Internal error", error: error.message })
    }
}

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 })

        res.status(200).json({
            message: "Movies fetched successfully",
            count: movies.length,
            movies
        })
    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params
        const movie = await Movie.findById(id)

        if (!movie) {
            return res.status(404).json({ message: "movie not found" })
        }

        res.status(200).json({
            message: "movie fetched successfully",
            movie
        })

    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params
        const movie = await Movie.findByIdAndDelete(id)

        if (!movie) {
            return res.status(404).json({ message: "movie not found" })
        }

        res.status(200).json({
            message: "movie deleted successfully",
            movie
        })

    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}
export { addMovie, getMovies, getMovieById, deleteMovie }