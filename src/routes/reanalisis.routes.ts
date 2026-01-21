import { Router } from "express";
import {
  createReanalisis,
  deleteReanalisis,
  getReanalisisById,
  updateReanalisis,
} from "../controllers/reanalisis.controller";

const router = Router();

router.get("/:id", getReanalisisById);
router.post("/", createReanalisis);
router.patch("/:id", updateReanalisis);
router.delete("/:id", deleteReanalisis);

export default router;
