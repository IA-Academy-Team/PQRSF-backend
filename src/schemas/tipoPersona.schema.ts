import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./core/common.schema";

export const createTipoPersonaSchema = z
  .object({
    name: nonEmptyStringSchema,
  })
  .strict();

export const updateTipoPersonaSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
  })
  .strict();

export const deleteTipoPersonaSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateTipoPersonaDTO = z.infer<typeof createTipoPersonaSchema>;
export type UpdateTipoPersonaDTO = z.infer<typeof updateTipoPersonaSchema> & { id: number };
export type DeleteTipoPersonaDTO = z.infer<typeof deleteTipoPersonaSchema>;
