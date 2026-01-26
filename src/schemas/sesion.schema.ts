import { z } from "zod";
import {
  dateSchema,
  nonEmptyStringSchema,
  optionalDateSchema,
  optionalNullableDateSchema,
  optionalNullableStringSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createSesionSchema = z
  .object({
    token: nonEmptyStringSchema,
    expiresAt: dateSchema,
    ipAddress: optionalNullableStringSchema,
    userAgent: optionalNullableStringSchema,
    userId: positiveIntSchema,
  })
  .strict();

export const updateSesionSchema = z
  .object({
    token: nonEmptyStringSchema.optional(),
    expiresAt: optionalNullableDateSchema,
    ipAddress: optionalNullableStringSchema,
    userAgent: optionalNullableStringSchema,
    userId: positiveIntSchema.optional(),
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
  })
  .strict();

export const deleteSesionSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateSesionDTO = z.infer<typeof createSesionSchema>;
export type UpdateSesionDTO = z.infer<typeof updateSesionSchema> & { id: number };
export type DeleteSesionDTO = z.infer<typeof deleteSesionSchema>;
