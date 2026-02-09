import { Router } from "express";
import multer from "multer";
import {
  createChat,
  deleteChat,
  getChatById,
  listChatByArea,
  listChatByClient,
  listChatByUser,
  listChats,
  listChatSummaries,
  listChatSummariesByPqrs,
  updateChat,
} from "../controllers/chat.controller";
import {
  createMensaje,
  deleteMensaje,
  listMensajesByChat,
  sendChatFile,
  sendChatMessage,
  updateMensaje,
} from "../controllers/mensaje.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", listChats);
router.get("/summary", listChatSummaries);
router.get("/summary/pqrs", listChatSummariesByPqrs);
router.get("/client/:clientId", listChatByClient);
router.get("/user/:userId", listChatByUser);
router.get("/area/:areaId", listChatByArea);
router.get("/:id", getChatById);

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateChat' } } */
  createChat
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateChat' } } */
  updateChat
);
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
router.post(
  "/messages/send",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/SendChatMessage' } } */
  sendChatMessage
);
router.post(
  "/messages/send-file",
  upload.single("file"),
  sendChatFile
);
router.put(
  "/messages/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateMensaje' } } */
  updateMensaje
);
router.delete("/messages/:id", deleteMensaje);

export default router;
