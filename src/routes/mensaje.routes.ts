import { Router } from "express";
import {
  createMensaje,
  deleteMensaje,
  getMensajeById,
  listMensajesByChat,
  updateMensaje,
} from "../controllers/mensaje.controller";

const router = Router();

router.get("/chat/:chatId", listMensajesByChat);
router.get("/:id", getMensajeById);
router.post("/", createMensaje);
router.patch("/:id", updateMensaje);
router.delete("/:id", deleteMensaje);

export default router;
