import express from "express";
import {
  login,
  logout,
  register,
  getUser,
  refreshToken,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/register", register);
router.get("/user", verifyToken, getUser);
router.get("/refreshToken", refreshToken);

router.post("/login", login);
router.post("/logout", logout);

export default router;
