import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateTokens = (user: any) => {
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateAuthToken();
  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3600000,
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 604800000, // 7 days for refresh tokens
      sameSite: "none",
    });
    res.status(201).json({ user });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 604800000,
    });
    res.status(200).json({ user: { email: user.email, _id: user._id } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || "secret"
    ) as any;
    const user = await User.findById(decoded._id);
    if (!user) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 604800000,
    });
    res.status(200).json({ user: { email: user.email, _id: user._id } });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).send("Logged out successfully");
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
