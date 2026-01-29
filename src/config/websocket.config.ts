import type { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { DEV_HOST, FRONTEND_ORIGIN, FRONTEND_URL } from "./env.config";

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
  io.to(getChatRoom(chatId)).emit("chat_message", { chatId, message });
};

export const broadcastChatSummary = (payload: unknown) => {
  if (!io) return;
  io.to(SUMMARY_ROOM).emit("chat_summary", payload);
};

export const broadcastChatMode = (chatId: number, mode: number | null) => {
  if (!io) return;
  io.to(SUMMARY_ROOM).emit("chat_mode", { chatId, mode });
  io.to(getChatRoom(chatId)).emit("chat_mode", { chatId, mode });
};
