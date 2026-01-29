import { z } from "zod";
import {
  optionalDateSchema,
  optionalNullablePositiveIntSchema,
  optionalNullableStringSchema,
  positiveBigIntSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createMensajeSchema = z
  .object({
    content: optionalNullableStringSchema,
    type: optionalNullablePositiveIntSchema,
    chatId: positiveBigIntSchema,
  })
  .strict();

export const updateMensajeSchema = z
  .object({
    content: optionalNullableStringSchema,
    type: optionalNullablePositiveIntSchema,
    chatId: positiveBigIntSchema.optional(),
    createdAt: optionalDateSchema,
  })
  .strict();

export const deleteMensajeSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export const mensajeChatParamSchema = z
  .object({
    chatId: positiveBigIntSchema,
  })
  .strict();

export type CreateMensajeDTO = z.infer<typeof createMensajeSchema>;
export type UpdateMensajeDTO = z.infer<typeof updateMensajeSchema> & { id: number };
export type DeleteMensajeDTO = z.infer<typeof deleteMensajeSchema>;
