import express from "express";

import { getMovie, getMovies, searchMovies } from "../controllers/movie.controller";


const router = express.Router();

router.get("/", getMovies);
router.get("/movie/:movieId", getMovie);
router.get("/search", searchMovies);

export default router;
