import { z } from "zod";
import {
  optionalDateSchema,
  nonEmptyStringSchema,
  optionalNullableDateSchema,
  optionalNullableStringSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createCuentaSchema = z
  .object({
    providerId: nonEmptyStringSchema,
    providerAccountId: nonEmptyStringSchema,
    password: optionalNullableStringSchema,
    accessToken: optionalNullableStringSchema,
    refreshToken: optionalNullableStringSchema,
    idToken: optionalNullableStringSchema,
    accessTokenExpiresAt: optionalNullableDateSchema,
    refreshTokenExpiresAt: optionalNullableDateSchema,
    scope: optionalNullableStringSchema,
    userId: positiveIntSchema,
  })
  .strict();

export const updateCuentaSchema = z
  .object({
    providerId: nonEmptyStringSchema.optional(),
    providerAccountId: nonEmptyStringSchema.optional(),
    password: optionalNullableStringSchema,
    accessToken: optionalNullableStringSchema,
    refreshToken: optionalNullableStringSchema,
    idToken: optionalNullableStringSchema,
    accessTokenExpiresAt: optionalNullableDateSchema,
    refreshTokenExpiresAt: optionalNullableDateSchema,
    scope: optionalNullableStringSchema,
    userId: positiveIntSchema.optional(),
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
  })
  .strict();

export const deleteCuentaSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateCuentaDTO = z.infer<typeof createCuentaSchema>;
export type UpdateCuentaDTO = z.infer<typeof updateCuentaSchema> & { id: number };
export type DeleteCuentaDTO = z.infer<typeof deleteCuentaSchema>;
