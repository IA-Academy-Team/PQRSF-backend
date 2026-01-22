import { z } from "zod";
import {
  nonEmptyStringSchema,
  optionalDateSchema,
  optionalPositiveIntSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createRespuestaSchema = z
  .object({
    content: nonEmptyStringSchema,
    channel: optionalPositiveIntSchema,
    documentId: positiveIntSchema,
    pqrsId: positiveIntSchema,
    responsibleId: positiveIntSchema,
  })
  .strict();

export const updateRespuestaSchema = z
  .object({
    content: nonEmptyStringSchema.optional(),
    channel: optionalPositiveIntSchema,
    documentId: positiveIntSchema.optional(),
    pqrsId: positiveIntSchema.optional(),
    responsibleId: positiveIntSchema.optional(),
    sentAt: optionalDateSchema,
  })
  .strict();

export const deleteRespuestaSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateRespuestaDTO = z.infer<typeof createRespuestaSchema>;
export type UpdateRespuestaDTO = z.infer<typeof updateRespuestaSchema> & { id: number };
export type DeleteRespuestaDTO = z.infer<typeof deleteRespuestaSchema>;
