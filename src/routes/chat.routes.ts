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
router.post("/", createChat);
router.patch("/:id", updateChat);
router.delete("/:id", deleteChat);

export default router;
