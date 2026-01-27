import { Request, Response } from "express";
import { asyncHandler } from "../utils/controller.utils";
import { AppError } from "../middlewares/error.middleware";
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
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (!WHATSAPP_VERIFY_TOKEN) {
      console.error("[webhook][whatsapp][verify] missing WHATSAPP_VERIFY_TOKEN env");
      res.status(500).json({ error: "Webhook not configured" });
      return;
    }

    if (!mode || !token || !challenge) {
      console.warn("[webhook][whatsapp][verify] missing query params", {
        mode,
        tokenPresent: Boolean(token),
        challengePresent: Boolean(challenge),
      });
      res.status(400).json({ error: "Missing verification params" });
      return;
    }

    if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
      console.info("[webhook][whatsapp][verify] verified");
      res.status(200).send(challenge);
      return;
    }

    console.warn("[webhook][whatsapp][verify] invalid token", {
      mode,
      tokenPresent: Boolean(token),
    });
    res.status(403).json({ error: "Invalid verify token" });
  } catch (err) {
    console.error("[webhook][whatsapp][verify] unexpected error", err);
    res.status(500).json({ error: "Webhook verification failed" });
  }
});

export const receiveWhatsappWebhook = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn("[webhook][whatsapp][receive] empty body");
      res.status(400).json({ error: "Empty webhook body" });
      return;
    }

    const { text, from, raw } = extractWhatsappPayload(req.body);
    if (!text || !from) {
      console.warn("[webhook][whatsapp][receive] payload missing text or from", {
        hasText: Boolean(text),
        hasFrom: Boolean(from),
      });
      res.status(204).send();
      return;
    }

    await integrationService.handleInboundMessage({
      channel: "whatsapp",
      from,
      content: text,
      metadata: { raw },
    });

    console.info("[webhook][whatsapp][receive] message received", { from });
    res.status(200).json({ received: true });
  } catch (err) {
    if (err instanceof AppError) {
      console.error("[webhook][whatsapp][receive] app error", {
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
    console.error("[webhook][whatsapp][receive] unexpected error", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});
