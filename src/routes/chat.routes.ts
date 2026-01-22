import { Router } from "express";
import {
  createChat,
  deleteChat,
  getChatById,
  listChatByClient,
  updateChat,
} from "../controllers/chat.controller";

const router = Router();

router.get("/client/:clientId", listChatByClient);
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
router.delete("/:id", deleteChat);

export default router;
