import { AppError } from "../middlewares/error.middleware";
import { ChatRepository } from "../repositories/chat.repository";
import { ClienteRepository } from "../repositories/cliente.repository";
import { MensajeService } from "./mensaje.service";
import { uploadToS3 } from "./s3.service";
import path from "path";
import { broadcastChatMessage, broadcastChatSummary } from "../config/websocket.config";
import {
  N8N_WEBHOOK_URL,
  TELEGRAM_BOT_TOKEN,
} from "../config/env.config";
import type { SendChatMessageDTO } from "../schemas/chatIntegration.schema";
import { optionalString, requireBigInt } from "../utils/validation.utils";

type InboundPayload = {
  channel: "telegram";
  from: string;
  content: string;
  name?: string | null;
  metadata?: Record<string, unknown>;
};

const TELEGRAM_API_BASE = "https://api.telegram.org";

const sendTelegramMessage = async (chatId: string, text: string) => {
  const hasTelegramToken = Boolean(TELEGRAM_BOT_TOKEN);
  console.info("[telegram][send] request", {
    chatId,
    hasTelegramToken,
  });

  if (!TELEGRAM_BOT_TOKEN) {
    throw new AppError("Telegram credentials not configured", 503, "TELEGRAM_NOT_CONFIGURED");
  }

  const response = await fetch(`${TELEGRAM_API_BASE}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.warn("[telegram][send] failed", {
      chatId,
      status: response.status,
      errorBody,
      hasTelegramToken,
    });
    const normalizedError = errorBody.toLowerCase();
    if (response.status === 400 && normalizedError.includes("chat not found")) {
      throw new AppError("Telegram chat not found", 400, "TELEGRAM_CHAT_NOT_FOUND", {
        chatId,
        status: response.status,
        errorBody,
      });
    }
    throw new AppError("Failed to send Telegram message", 502, "TELEGRAM_SEND_FAILED", {
      status: response.status,
      errorBody,
    });
  }

  console.info("[telegram][send] success", {
    chatId,
    status: response.status,
  });
};

const normalizeTelegramChatId = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("tg:")) return normalized.slice(3);
  if (normalized.startsWith("telegram:")) return normalized.slice(9);
  return value.trim();
};

const tagTelegramPhone = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith("tg:") || trimmed.toLowerCase().startsWith("telegram:")) {
    return trimmed;
  }
  return `tg:${trimmed}`;
};

export const notifyN8n = async (payload: Record<string, unknown>) => {
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

  private async findChatClient(clientId: bigint | null | undefined) {
    if (!clientId) return null;
    return this.clientRepo.findById(clientId);
  }

  private resolveTelegramChatId(chatId: bigint, phoneNumber: string | null | undefined) {
    const normalized = phoneNumber?.trim() ?? "";
    if (normalized.toLowerCase().startsWith("tg:") || normalized.toLowerCase().startsWith("telegram:")) {
      return normalizeTelegramChatId(normalized);
    }
    return String(chatId);
  }

  private resolveTelegramChatIdCandidates(chatId: bigint, phoneNumber: string | null | undefined) {
    const primary = this.resolveTelegramChatId(chatId, phoneNumber);
    const fallback = String(chatId);
    return primary === fallback ? [primary] : [primary, fallback];
  }

  private async sendTelegramWithFallback(params: {
    chatId: bigint;
    clientId: bigint | null | undefined;
    phoneNumber: string | null | undefined;
    content: string;
  }) {
    const { chatId, clientId, phoneNumber, content } = params;
    const candidates = this.resolveTelegramChatIdCandidates(chatId, phoneNumber);
    let lastError: AppError | null = null;

    for (const candidate of candidates) {
      try {
        await sendTelegramMessage(candidate, content);
        if (clientId && candidate === String(chatId) && tagTelegramPhone(candidate) !== phoneNumber) {
          await this.clientRepo.update({
            id: clientId,
            phoneNumber: tagTelegramPhone(candidate),
          });
        }
        return;
      } catch (error) {
        if (error instanceof AppError && error.code === "TELEGRAM_CHAT_NOT_FOUND") {
          lastError = error;
          continue;
        }
        throw error;
      }
    }

    throw new AppError(
      "Telegram chat not found. The user must start a conversation with the current bot before the system can reply.",
      400,
      "TELEGRAM_CHAT_NOT_FOUND",
      {
        attemptedChatIds: candidates,
        lastError: lastError?.details ?? null,
      }
    );
  }

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

  private async getOrCreateClientByPhone(
    phone: string,
    channel: "telegram",
    name?: string | null
  ) {
    const raw = optionalString(phone, "phone") ?? "";
    const normalized = tagTelegramPhone(raw);
    if (!normalized) {
      throw new AppError("Phone number is required", 400, "VALIDATION_ERROR", { phone });
    }

    const displayName = optionalString(name, "name") ?? null;

    const existing = await this.clientRepo.findByPhoneNumber(normalized);
    if (existing) {
      if ((!existing.name && displayName) || !existing.phoneNumber) {
        const updated = await this.clientRepo.update({
          id: existing.id,
          name: existing.name ?? displayName,
          phoneNumber: existing.phoneNumber ?? normalized,
        });
        return updated ?? existing;
      }
      return existing;
    }

    let id = BigInt(Date.now());
    while (await this.clientRepo.findById(id)) {
      id += BigInt(1);
    }

    return this.clientRepo.create({
      id,
      name: displayName ?? "Usuario Telegram",
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

    const client = await this.findChatClient(chat.clientId);

    console.info("[chat][send-manual][telegram]", {
      chatId: String(chatId),
      clientId: chat.clientId ? String(chat.clientId) : null,
    });

    await this.sendTelegramWithFallback({
      chatId: chat.id,
      clientId: chat.clientId,
      phoneNumber: client?.phoneNumber,
      content,
    });

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

  async sendAdminFile(params: {
    chatId: bigint;
    file: Express.Multer.File;
  }) {
    const chatId = requireBigInt(params.chatId, "chatId");
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new AppError("Chat not found", 404, "NOT_FOUND", { chatId });
    }

    const mode = chat.mode ?? 1;
    if (mode !== 2) {
      throw new AppError("Chat is in IA mode", 409, "CHAT_MODE_AI", { chatId, mode });
    }

    const file = params.file;
    const ext = path.extname(file.originalname || "").replace(/[^a-zA-Z0-9.]/g, "");
    const baseName = path.basename(file.originalname || "archivo", ext).replace(/[^\w.-]+/g, "_");
    const key = `chats/${String(chatId)}/${Date.now()}_${baseName}${ext}`;
    const fileUrl = await uploadToS3({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    const content = `${file.originalname || "archivo"}: ${fileUrl}`;
    const client = await this.findChatClient(chat.clientId);

    console.info("[chat][send-file][telegram]", {
      chatId: String(chatId),
      clientId: chat.clientId ? String(chat.clientId) : null,
      fileName: file.originalname || "archivo",
    });

    await this.sendTelegramWithFallback({
      chatId: chat.id,
      clientId: chat.clientId,
      phoneNumber: client?.phoneNumber,
      content,
    });

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
    const client = await this.getOrCreateClientByPhone(payload.from, payload.channel, payload.name);
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
