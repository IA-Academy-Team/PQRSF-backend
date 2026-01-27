import { Router } from "express";
import {
  receiveWhatsappWebhook,
  verifyWhatsappWebhook,
} from "../controllers/webhook.controller";

const router = Router();

// UNUSED (frontend)
router.get("/webhook", verifyWhatsappWebhook);
// UNUSED (frontend)
router.post("/webhook", receiveWhatsappWebhook);
// UNUSED (frontend)
// router.post("/telegram", receiveTelegramWebhook);

export default router;
