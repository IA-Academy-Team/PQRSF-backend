import { z } from "zod";
import { positiveBigIntSchema } from "./core/common.schema";

export const sendChatMessageSchema = z
  .object({
    chatId: positiveBigIntSchema,
    content: z.string().min(1),
    channel: z.enum(["whatsapp", "telegram"]).optional(),
  })
  .strict();

export type SendChatMessageDTO = z.infer<typeof sendChatMessageSchema>;
