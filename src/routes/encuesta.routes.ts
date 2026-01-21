import { Router } from "express";
import {
  createEncuesta,
  deleteEncuesta,
  getEncuestaById,
  updateEncuesta,
} from "../controllers/encuesta.controller";

const router = Router();

router.get("/:id", getEncuestaById);
router.post("/", createEncuesta);
router.patch("/:id", updateEncuesta);
router.delete("/:id", deleteEncuesta);

export default router;
