import { Router } from "express";
import {
  createAnalisis,
  deleteAnalisis,
  getAnalisisById,
  updateAnalisis,
} from "../controllers/analisis.controller";

const router = Router();

router.get("/:id", getAnalisisById);
router.post("/", createAnalisis);
router.patch("/:id", updateAnalisis);
router.delete("/:id", deleteAnalisis);

export default router;
