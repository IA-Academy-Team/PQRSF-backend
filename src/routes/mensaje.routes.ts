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
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateMensaje' } } */
  createMensaje
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateMensaje' } } */
  updateMensaje
);
router.delete("/:id", deleteMensaje);

export default router;
