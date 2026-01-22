import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./common.schema";

export const createTipoDocumentoSchema = z
  .object({
    name: nonEmptyStringSchema,
  })
  .strict();

export const updateTipoDocumentoSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
  })
  .strict();

export const deleteTipoDocumentoSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateTipoDocumentoDTO = z.infer<typeof createTipoDocumentoSchema>;
export type UpdateTipoDocumentoDTO = z.infer<typeof updateTipoDocumentoSchema> & { id: number };
export type DeleteTipoDocumentoDTO = z.infer<typeof deleteTipoDocumentoSchema>;
