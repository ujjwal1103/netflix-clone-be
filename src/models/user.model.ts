import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  password: string;
  generateAuthToken(): string;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
