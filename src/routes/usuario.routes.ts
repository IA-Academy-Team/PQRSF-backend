import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  listUsuarios,
  updateUsuario,
} from "../controllers/usuario.controller";

const router = Router();

router.get("/", listUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.patch("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;
