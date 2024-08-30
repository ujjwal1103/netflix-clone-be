import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import favoritesRoutes from "./routes/favorite.route";
import movieRoutes from "./routes/movie.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

const mongoUri: string = process.env.MONGO_URI || "";
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.use("/api/auth", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("Netflix Clone Backend");
});

export default app;
