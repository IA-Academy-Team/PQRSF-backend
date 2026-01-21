import { Router } from "express";
import {
  createRespuesta,
  deleteRespuesta,
  getRespuestaById,
  updateRespuesta,
} from "../controllers/respuesta.controller";

const router = Router();

router.get("/:id", getRespuestaById);
router.post("/", createRespuesta);
router.patch("/:id", updateRespuesta);
router.delete("/:id", deleteRespuesta);

export default router;
