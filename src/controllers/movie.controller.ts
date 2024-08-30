import { Request, Response } from "express";
import Movie from "../models/movie.model";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const searchMovies = async (req: Request, res: Response) => {
  const { search } = req.query;

  try {
    if (!search) {
      return res.status(200).json([]);
    }

    const movies = await Movie.aggregate([
      {
        $match: {
          title: { $regex: new RegExp(search as string, "i") },
        },
      },
    ]);

    res.status(200).json(movies);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    res.status(200).json(movie);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
