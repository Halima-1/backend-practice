import { Router } from "express";
import { addMovie, deleteMovie, getMovieById, getMovies } from "../controllers/movie.controller.js";

const movieRoutes = Router();

// POST /api/v1/movies/addMovie
movieRoutes.route("/addMovie").post(addMovie);

// GET /api/v1/movies
movieRoutes.route("/").get(getMovies);
movieRoutes.route("/:id").get(getMovieById);
movieRoutes.route("/:id").delete(deleteMovie);



export default movieRoutes;