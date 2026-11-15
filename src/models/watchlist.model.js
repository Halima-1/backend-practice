import mongoose from "mongoose"

const watchlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"],
        },
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: [true, "Movie ID is required"],
        },
        movieTitle: {
            type: String,
            required: [true, "Movie title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Planned", "Watching", "Completed", "Dropped"],
            default: "Planned",
        },
        rating: {
            type: Number,
            required: false,
            min: [0, "Rating cannot be less than 0"],
            max: [10, "Rating cannot exceed 10"],
        },
        notes: {
            type: String,
            required: false,
            trim: true,
        },
    },
    { timestamps: true }
)

export const WatchlistItem = mongoose.model("WatchlistItem", watchlistSchema)