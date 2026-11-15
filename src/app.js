import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import movieRoute from "./routes/movie.route.js";
import watchlistRoutes from "./routes/watchlist.route.js";

const app = express();

// parse JSON bodies and cookies — must come BEFORE routes
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send({ title: "I just started learning backend" });
});

// study on: app.use(express.urlencoded({extended:false}))
// app.use(cookie)

// routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/movies", movieRoute)
app.use("/api/v1/watchlist", watchlistRoutes)
                

// error handler 
app.use(errorMiddleware)

export default app