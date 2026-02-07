import type { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { DEV_HOST, FRONTEND_ORIGIN, FRONTEND_URL } from "./env.config";
import { normalizeValues } from "../utils/validation.utils";

let io: SocketServer | null = null;

const getChatRoom = (chatId: number) => `chat:${chatId}`;
const SUMMARY_ROOM = "summary";

export const initWebsocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    path: "/ws",
    cors: {
      origin: [FRONTEND_ORIGIN, FRONTEND_URL, DEV_HOST].filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const scope = String(socket.handshake.query.scope ?? "");
    const chatIdRaw = socket.handshake.query.chatId;
    const chatId = typeof chatIdRaw === "string" ? Number(chatIdRaw) : NaN;

    if (scope === "summary") {
      socket.join(SUMMARY_ROOM);
      return;
    }

    if (Number.isFinite(chatId)) {
      socket.join(getChatRoom(chatId));
    } else {
      socket.join(SUMMARY_ROOM);
    }
  });
};

export const broadcastChatMessage = (chatId: number, message: unknown) => {
  if (!io) return;
  const payload = normalizeValues([{ chatId, message }])[0];
  io.to(getChatRoom(chatId)).emit("chat_message", payload);
};

export const broadcastChatSummary = (payload: unknown) => {
  if (!io) return;
  const normalized = normalizeValues([payload])[0];
  io.to(SUMMARY_ROOM).emit("chat_summary", normalized);
};

export const broadcastChatMode = (chatId: number, mode: number | null) => {
  if (!io) return;
  const payload = normalizeValues([{ chatId, mode }])[0];
  io.to(SUMMARY_ROOM).emit("chat_mode", payload);
  io.to(getChatRoom(chatId)).emit("chat_mode", payload);
};
