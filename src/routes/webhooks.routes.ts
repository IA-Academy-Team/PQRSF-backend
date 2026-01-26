import { Router } from "express";
import {
  receiveTelegramWebhook,
  receiveWhatsappWebhook,
  verifyWhatsappWebhook,
} from "../controllers/webhook.controller";

const router = Router();

router.get("/whatsapp", verifyWhatsappWebhook);
router.post("/whatsapp", receiveWhatsappWebhook);
router.post("/telegram", receiveTelegramWebhook);

export default router;
