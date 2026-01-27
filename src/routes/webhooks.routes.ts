import { Router } from "express";
import {
  receiveTelegramWebhook,
  receiveWhatsappWebhook,
  verifyWhatsappWebhook,
} from "../controllers/webhook.controller";

const router = Router();

// UNUSED (frontend)
router.get("/whatsapp", verifyWhatsappWebhook);
// UNUSED (frontend)
router.post("/whatsapp", receiveWhatsappWebhook);
// UNUSED (frontend)
router.post("/telegram", receiveTelegramWebhook);

export default router;
