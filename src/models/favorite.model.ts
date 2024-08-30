import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Schema.Types.ObjectId;
  movieId:  mongoose.Schema.Types.ObjectId;
}

const favoriteSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
});

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
