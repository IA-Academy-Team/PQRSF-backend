import { z } from "zod";
import {
  dateSchema,
  nonEmptyStringSchema,
  optionalDateSchema,
  positiveIntSchema,
} from "./common.schema";

export const createVerificacionSchema = z
  .object({
    identifier: nonEmptyStringSchema,
    value: nonEmptyStringSchema,
    expiresAt: dateSchema,
  })
  .strict();

export const updateVerificacionSchema = z
  .object({
    identifier: nonEmptyStringSchema.optional(),
    value: nonEmptyStringSchema.optional(),
    expiresAt: dateSchema.optional(),
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
  })
  .strict();

export const deleteVerificacionSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateVerificacionDTO = z.infer<typeof createVerificacionSchema>;
export type UpdateVerificacionDTO = z.infer<typeof updateVerificacionSchema> & { id: number };
export type DeleteVerificacionDTO = z.infer<typeof deleteVerificacionSchema>;
