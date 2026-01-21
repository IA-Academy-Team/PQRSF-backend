import { Router } from "express";
import {
  createSesion,
  deleteSesion,
  getSesionById,
  updateSesion,
} from "../controllers/sesion.controller";

const router = Router();

router.get("/:id", getSesionById);
router.post("/", createSesion);
router.patch("/:id", updateSesion);
router.delete("/:id", deleteSesion);

export default router;
