import { AppError } from "../middlewares/error.middleware";
import { ChatRepository } from "../repositories/chat.repository";
import { ClienteRepository } from "../repositories/cliente.repository";
import { MensajeService } from "./mensaje.service";
import { broadcastChatMessage, broadcastChatSummary } from "../config/websocket.config";
import {
  CHAT_PROVIDER,
  N8N_WEBHOOK_URL,
  TELEGRAM_TOKEN,
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_ID,
} from "../config/env.config";
import type { SendChatMessageDTO } from "../schemas/chatIntegration.schema";
import { optionalString, requireBigInt } from "../utils/validation.utils";

type InboundPayload = {
  channel: "whatsapp" | "telegram";
  from: string;
  content: string;
  metadata?: Record<string, unknown>;
};

const WHATSAPP_API_BASE = "https://graph.facebook.com/v20.0";

const sendWhatsappMessage = async (to: string, text: string) => {
  if (CHAT_PROVIDER === "stub") {
    return;
  }
  if (!WHATSAPP_PHONE_ID || !WHATSAPP_ACCESS_TOKEN) {
    throw new AppError("WhatsApp credentials not configured", 500, "WHATSAPP_NOT_CONFIGURED");
  }

  const response = await fetch(`${WHATSAPP_API_BASE}/${WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new AppError("Failed to send WhatsApp message", 502, "WHATSAPP_SEND_FAILED", {
      status: response.status,
      errorBody,
    });
  }
};

const sendTelegramMessage = async (chatId: string, text: string) => {
  if (CHAT_PROVIDER === "stub") {
    return;
  }
  if (!TELEGRAM_TOKEN) {
    throw new AppError("Telegram credentials not configured", 500, "TELEGRAM_NOT_CONFIGURED");
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new AppError("Failed to send Telegram message", 502, "TELEGRAM_SEND_FAILED", {
      status: response.status,
      errorBody,
    });
  }
};

const notifyN8n = async (payload: Record<string, unknown>) => {
  if (!N8N_WEBHOOK_URL) return;
  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("[n8n] webhook error", error);
  }
};

export class ChatIntegrationService {
  constructor(
    private readonly chatRepo = new ChatRepository(),
    private readonly clientRepo = new ClienteRepository(),
    private readonly mensajeService = new MensajeService()
  ) {}

  private normalizeChatId(value: unknown): bigint {
    if (typeof value === "bigint") {
      if (value > 0n) return value;
      throw new AppError("Chat id must be positive", 400, "VALIDATION_ERROR", { chatId: value });
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      const normalized = BigInt(Math.trunc(value));
      if (normalized > 0n) return normalized;
    }

    if (typeof value === "string") {
      const digits = value.trim().replace(/\D/g, "");
      if (digits) {
        const normalized = BigInt(digits);
        if (normalized > 0n) return normalized;
      }
    }

    if (value && typeof value === "object") {
      const digits = String(value).replace(/\D/g, "");
      if (digits) {
        const normalized = BigInt(digits);
        if (normalized > 0n) return normalized;
      }
    }

    throw new AppError("Chat id could not be resolved", 500, "CHAT_ID_MISSING", {
      rawChatId: value,
    });
  }

  private async getOrCreateClientByPhone(phone: string) {
    const normalized = optionalString(phone, "phone") ?? "";
    if (!normalized) {
      throw new AppError("Phone number is required", 400, "VALIDATION_ERROR", { phone });
    }

    const existing = await this.clientRepo.findByPhoneNumber(normalized);
    if (existing) return existing;

    let id = BigInt(Date.now());
    while (await this.clientRepo.findById(id)) {
      id += BigInt(1);
    }

    return this.clientRepo.create({
      id,
      name: "Usuario WhatsApp",
      document: null,
      email: null,
      phoneNumber: normalized,
      typePersonId: null,
      stakeholderId: null,
    });
  }

  private async getOrCreateChat(clientId: bigint) {
    const existing = await this.chatRepo.findByClientId(clientId);
    if (existing) return existing;
    return this.chatRepo.create({
      id: clientId,
      clientId,
      mode: 1,
    });
  }

  async sendAdminMessage(data: SendChatMessageDTO) {
    const chatId = requireBigInt(data.chatId, "chatId");
    const content = optionalString(data.content, "content") ?? "";
    if (!content.trim()) {
      throw new AppError("content is required", 400, "VALIDATION_ERROR", { content });
    }

    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new AppError("Chat not found", 404, "NOT_FOUND", { chatId });
    }

    const mode = chat.mode ?? 1;
    if (mode !== 2) {
      throw new AppError("Chat is in IA mode", 409, "CHAT_MODE_AI", { chatId, mode });
    }

    const clientId = chat.clientId;
    if (!clientId) {
      throw new AppError("Chat has no client", 409, "CHAT_NO_CLIENT", { chatId });
    }

    const client = await this.clientRepo.findById(clientId);
    if (!client || !client.phoneNumber) {
      throw new AppError("Client phone is required", 409, "CHAT_NO_PHONE", { chatId, clientId });
    }

    const channel = data.channel ?? "whatsapp";
    if (CHAT_PROVIDER === "telegram" || channel === "telegram") {
      await sendTelegramMessage(client.phoneNumber, content);
    } else {
      await sendWhatsappMessage(client.phoneNumber, content);
    }

    const message = await this.mensajeService.create({
      chatId,
      content,
      type: 3,
    });

    const numericChatId = Number(chatId);
    if (Number.isFinite(numericChatId)) {
      broadcastChatMessage(numericChatId, message);
      broadcastChatSummary({
        chatId: numericChatId,
        lastMessage: message.content ?? "",
        lastMessageAt: message.createdAt ?? null,
      });
    }

    return message;
  }

  async handleInboundMessage(payload: InboundPayload) {
    const client = await this.getOrCreateClientByPhone(payload.from);
    const chat = await this.getOrCreateChat(client.id);

    const rawChatId: unknown = chat?.id ?? chat?.clientId ?? client?.id;
    const chatId = this.normalizeChatId(rawChatId);
    const message = await this.mensajeService.create({
      chatId,
      content: payload.content,
      type: 1,
    });

    const numericChatId = Number(chatId);
    if (Number.isFinite(numericChatId)) {
      broadcastChatMessage(numericChatId, message);
      broadcastChatSummary({
        chatId: numericChatId,
        lastMessage: message.content ?? "",
        lastMessageAt: message.createdAt ?? null,
      });
    }

    if ((chat.mode ?? 1) === 1) {
      await notifyN8n({
        chatId: String(chatId),
        clientId: String(client.id),
        phoneNumber: client.phoneNumber,
        content: payload.content,
        channel: payload.channel,
        metadata: payload.metadata ?? {},
      });
    }

    return { chatId: chat.id, message };
  }
}
