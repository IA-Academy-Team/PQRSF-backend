import { Router } from "express";
import {
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/password/request", requestPasswordReset);
router.post("/password/reset", resetPassword);

export default router;
