import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./core/common.schema";

export const createDocumentoSchema = z
  .object({
    url: nonEmptyStringSchema,
    typeDocumentId: positiveIntSchema,
    pqrsId: positiveIntSchema,
  })
  .strict();

export const updateDocumentoSchema = z
  .object({
    url: nonEmptyStringSchema.optional(),
    typeDocumentId: positiveIntSchema.optional(),
    pqrsId: positiveIntSchema.optional(),
  })
  .strict();

export const deleteDocumentoSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateDocumentoDTO = z.infer<typeof createDocumentoSchema>;
export type UpdateDocumentoDTO = z.infer<typeof updateDocumentoSchema> & { id: number };
export type DeleteDocumentoDTO = z.infer<typeof deleteDocumentoSchema>;
