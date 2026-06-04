import { Router } from "express";
import {
  receiveWhatsappWebhook,
  receiveTelegramWebhook,
  verifyWhatsappWebhook,
} from "../controllers/webhook.controller";

const router = Router();

// #swagger.tags = ['Webhooks']
// #swagger.description = 'Deprecated WhatsApp webhook verification. WhatsApp chat integration is no longer supported.'
// #swagger.parameters['hub.mode'] = { in: 'query', required: true, type: 'string', example: 'subscribe' }
// #swagger.parameters['hub.verify_token'] = { in: 'query', required: true, type: 'string', example: 'your_verify_token' }
// #swagger.parameters['hub.challenge'] = { in: 'query', required: true, type: 'string', example: '123' }
router.get("/webhook", verifyWhatsappWebhook);
// #swagger.tags = ['Webhooks']
// #swagger.description = 'Deprecated WhatsApp webhook receiver. WhatsApp chat integration is no longer supported.'
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/WhatsappWebhookPayload' } }
router.post("/webhook", receiveWhatsappWebhook);
// #swagger.tags = ['Webhooks']
// #swagger.description = 'Receives Telegram webhook events.'
router.post("/telegram/webhook", receiveTelegramWebhook);

export default router;
