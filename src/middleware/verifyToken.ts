import { Response, NextFunction, Request as ExRequest } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface IUser {
  _id: string;
  email: string;
}

export interface Request extends ExRequest {
  user?: IUser;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3600000, // 1 hour
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET || "secret"
      );
      req.user = decoded as IUser;
      return next();
    } else {
      if (refreshToken) {
        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET || "secret"
          ) as IUser;
          const user = await User.findById(decodedRefresh._id);

          if (!user) {
            return res.status(401).json({ error: "User not found" });
          }

          const newAccessToken = user.generateAuthToken();
          req.user = decodedRefresh;
          res.cookie("accessToken", newAccessToken, cookieOptions);

          return next();
        } catch (refreshError) {
          return res.status(401).json({ error: "Invalid refresh token" });
        }
      }
      return res.status(401).json({ error: "Access denied" });
    }
  } catch (error: any) {
    return res.status(401).json({ error: "Access denied" });
  }
};
