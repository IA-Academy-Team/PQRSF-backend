import { Request, Response } from "express";
import { asyncHandler } from "../utils/controller.utils";
import { AppError } from "../middlewares/error.middleware";
import { ChatIntegrationService } from "../services/chat-integration.service";

const integrationService = new ChatIntegrationService();

export const verifyWhatsappWebhook = asyncHandler(async (req: Request, res: Response) => {
  console.warn("[webhook][whatsapp][verify] unsupported channel", { query: req.query });
  res.status(410).json({ error: "WhatsApp chat integration is no longer supported" });
});

export const receiveWhatsappWebhook = asyncHandler(async (req: Request, res: Response) => {
  console.warn("[webhook][whatsapp][receive] unsupported channel");
  res.status(410).json({ error: "WhatsApp chat integration is no longer supported" });
});

const extractTelegramPayload = (body: any) => {
  const message = body?.message ?? body?.edited_message;
  const text = message?.text;
  const chatId = message?.chat?.id;
  return { text, chatId, raw: body };
};

export const receiveTelegramWebhook = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn("[webhook][telegram][receive] empty body");
      res.status(400).json({ error: "Empty webhook body" });
      return;
    }

    const { text, chatId, raw } = extractTelegramPayload(req.body);
    if (!text || !chatId) {
      console.warn("[webhook][telegram][receive] payload missing text or chatId", {
        hasText: Boolean(text),
        hasChatId: Boolean(chatId),
      });
      res.status(204).send();
      return;
    }

    await integrationService.handleInboundMessage({
      channel: "telegram",
      from: String(chatId),
      content: text,
      metadata: { raw },
    });

    console.info("[webhook][telegram][receive] message received", { chatId });
    res.status(200).json({ received: true });
  } catch (err) {
    if (err instanceof AppError) {
      console.error("[webhook][telegram][receive] app error", {
        code: err.code,
        message: err.message,
        details: err.details,
      });
      res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
        details: err.details,
      });
      return;
    }
    console.error("[webhook][telegram][receive] unexpected error", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
