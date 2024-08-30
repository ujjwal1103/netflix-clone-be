import mongoose, { Document, Schema } from 'mongoose';

interface IMovie extends Document {
  rank: number;
  title: string;
  description: string;
  image: string;
  big_image: string;
  genre: string[];
  thumbnail: string;
  rating: string;
  id: string;
  year: number;
  imdbid: string;
  imdb_link: string;
}

const movieSchema: Schema = new Schema({
  rank: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  big_image: { type: String, required: true },
  genre: { type: [String], required: true },
  thumbnail: { type: String, required: true },
  rating: { type: String, required: true },
  year: { type: Number, required: true },
  imdbid: { type: String, required: true },
  imdb_link: { type: String, required: true }
});

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;