import { Router } from "express";
import {
  createMensaje,
  deleteMensaje,
  getMensajeById,
  listMensajesByChat,
  updateMensaje,
} from "../controllers/mensaje.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateMensaje' } } */
  createMensaje
);
// UNUSED (frontend)
router.get("/chat/:chatId", listMensajesByChat);
// UNUSED (frontend)
router.get("/:id", getMensajeById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateMensaje' } } */
  updateMensaje
);
// UNUSED (frontend)
router.delete("/:id", deleteMensaje);

export default router;
