import { Router } from "express";
import {
  createVerificacion,
  deleteVerificacion,
  getVerificacionById,
  updateVerificacion,
} from "../controllers/verificacion.controller";

const router = Router();

router.get("/:id", getVerificacionById);
router.post("/", createVerificacion);
router.patch("/:id", updateVerificacion);
router.delete("/:id", deleteVerificacion);

export default router;
