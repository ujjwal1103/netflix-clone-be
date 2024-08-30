import { Response, Request } from "express";
import Favorite from "../models/favorite.model";
import mongoose from "mongoose";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const userId = (req as any).user._id;

    const existingFavorite = await Favorite.findOne({ movieId, user: userId });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Favorite already exists",
      });
    }
    const favorite = new Favorite({ user: userId, movieId });
    await favorite.save();

    const addedFavorite = await Favorite.findOne({
      movieId,
      user: userId,
    }).populate("movieId");
    res.status(201).json({
      message: "Favorite added",
      movie: addedFavorite!.movieId,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const userId = (req as any).user._id;

    const result = await Favorite.deleteOne({ movieId, user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error: any) {
    console.error("Error removing favorite:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const favorites = await Favorite.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $addFields: {
          movie: {
            $first: "$movie",
          },
        },
      },
      {
        $unwind: "$movie",
      },
    ]);
    res.status(200).json(favorites.map((fav) => fav.movie));
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
