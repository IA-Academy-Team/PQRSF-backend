import { Router } from "express";
import {
  createChat,
  deleteChat,
  getChatById,
  listChatByArea,
  listChatByUser,
  listChats,
  updateChat,
} from "../controllers/chat.controller";
import {
  createMensaje,
  deleteMensaje,
  listMensajesByChat,
  updateMensaje,
} from "../controllers/mensaje.controller";

const router = Router();

router.get("/", listChats);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateChat' } } */
  createChat
);
router.get("/user/:userId", listChatByUser);
router.get("/area/:areaId", listChatByArea);
router.get("/:id", getChatById);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateChat' } } */
  updateChat
);
router.delete("/:id", deleteChat);

router.get("/:chatId/messages", listMensajesByChat);
router.post(
  "/messages",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateMensaje' } } */
  createMensaje
);
router.put(
  "/messages/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateMensaje' } } */
  updateMensaje
);
router.delete("/messages/:id", deleteMensaje);

export default router;
