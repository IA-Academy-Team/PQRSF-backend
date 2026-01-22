import { z } from "zod";
import {
  optionalNullablePositiveIntSchema,
  optionalPositiveBigIntSchema,
  positiveBigIntSchema,
} from "./common.schema";

export const createChatSchema = z
  .object({
    id: positiveBigIntSchema,
    mode: optionalNullablePositiveIntSchema,
    clientId: positiveBigIntSchema,
  })
  .strict();

export const updateChatSchema = z
  .object({
    mode: optionalNullablePositiveIntSchema,
    clientId: optionalPositiveBigIntSchema,
  })
  .strict();

export const deleteChatSchema = z
  .object({
    id: positiveBigIntSchema,
  })
  .strict();

export const chatIdParamSchema = z
  .object({
    id: positiveBigIntSchema,
  })
  .strict();

export const chatClientParamSchema = z
  .object({
    clientId: positiveBigIntSchema,
  })
  .strict();

export type CreateChatDTO = z.infer<typeof createChatSchema>;
export type UpdateChatDTO = z.infer<typeof updateChatSchema> & { id: bigint };
export type DeleteChatDTO = z.infer<typeof deleteChatSchema>;
