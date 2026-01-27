import { Router } from "express";
import {
  receiveWhatsappWebhook,
  verifyWhatsappWebhook,
} from "../controllers/webhook.controller";

const router = Router();

// UNUSED (frontend)
// #swagger.tags = ['Webhooks']
// #swagger.description = 'Verifies WhatsApp webhook. Returns hub.challenge when the verify token matches.'
// #swagger.parameters['hub.mode'] = { in: 'query', required: true, type: 'string', example: 'subscribe' }
// #swagger.parameters['hub.verify_token'] = { in: 'query', required: true, type: 'string', example: 'your_verify_token' }
// #swagger.parameters['hub.challenge'] = { in: 'query', required: true, type: 'string', example: '123' }
router.get("/webhook", verifyWhatsappWebhook);
// UNUSED (frontend)
// #swagger.tags = ['Webhooks']
// #swagger.description = 'Receives WhatsApp Cloud API webhook events.'
// #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/WhatsappWebhookPayload' } }
router.post("/webhook", receiveWhatsappWebhook);
// UNUSED (frontend)
// router.post("/telegram", receiveTelegramWebhook);

export default router;
