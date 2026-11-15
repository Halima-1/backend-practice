import mongoose from "mongoose"

const movieSchema = new mongoose.Schema(
    {
        movieTitle: {
            type: String,
            required: [true, "Movie title is required"],
            unique: [true, "Movie title already exists"],
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        // TODO: set required: true once auth middleware (req.user) is wired up
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false
        },
        // Optional external ID (e.g. from TMDB API)
        movieId: {
            type: String,
            required: false,
            unique: true,
            sparse: true,   // allows multiple docs to have null/undefined movieId without unique conflict
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: [0, "Rating cannot be less than 0"],
            max: [10, "Rating cannot exceed 10"]
        },
        category: {
            type: String,
            required: true,
            enum: ["Planned", "Watching", "Completed", "Dropped"]
        },
        notes: {
            type: String,
            required: false,
            trim: true,
            minLength: 2,
            maxLength: 100
        }
    },
    { timestamps: true }
)

export const Movie = mongoose.model("Movie", movieSchema)