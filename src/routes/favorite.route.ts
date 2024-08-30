import express from "express";
import { addFavorite, deleteFavorite, getFavorites } from "../controllers/favorite.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/:movieId", verifyToken, addFavorite);
router.delete("/:movieId", verifyToken, deleteFavorite);
router.get("/", verifyToken, getFavorites);

export default router;
