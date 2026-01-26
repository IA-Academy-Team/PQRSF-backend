import { Request, Response } from "express";
import { asyncHandler } from "../utils/controller.utils";
import { ChatIntegrationService } from "../services/chat-integration.service";
import { WHATSAPP_VERIFY_TOKEN } from "../config/env.config";

const integrationService = new ChatIntegrationService();

const extractWhatsappPayload = (body: any) => {
  const entry = body?.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];
  const text = message?.text?.body;
  const from = message?.from || change?.contacts?.[0]?.wa_id;
  return { text, from, raw: body };
};

export const verifyWhatsappWebhook = asyncHandler(async (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    return;
  }

  res.status(403).json({ error: "Invalid verify token" });
});

export const receiveWhatsappWebhook = asyncHandler(async (req: Request, res: Response) => {
  const { text, from, raw } = extractWhatsappPayload(req.body);
  if (!text || !from) {
    res.status(204).send();
    return;
  }

  await integrationService.handleInboundMessage({
    channel: "whatsapp",
    from,
    content: text,
    metadata: { raw },
  });

  res.status(200).json({ received: true });
});

export const receiveTelegramWebhook = asyncHandler(async (req: Request, res: Response) => {
  const message = req.body?.message;
  const text = message?.text;
  const chatId = message?.chat?.id;
  if (!text || !chatId) {
    res.status(204).send();
    return;
  }

  await integrationService.handleInboundMessage({
    channel: "telegram",
    from: String(chatId),
    content: text,
    metadata: { raw: req.body },
  });

  res.status(200).json({ received: true });
});
