import { z } from "zod";
import {
  emailSchema,
  optionalBooleanSchema,
  optionalDateSchema,
  optionalNullableDateSchema,
  optionalNullableStringSchema,
  positiveIntSchema,
} from "./common.schema";

export const createUsuarioSchema = z
  .object({
    email: emailSchema,
    name: optionalNullableStringSchema,
    image: optionalNullableStringSchema,
    phoneNumber: optionalNullableStringSchema,
    isActive: optionalBooleanSchema,
    emailVerified: optionalBooleanSchema,
    twoFactorEnabled: optionalBooleanSchema,
    lastLogin: optionalNullableDateSchema,
    roleId: positiveIntSchema,
  })
  .strict();

export const updateUsuarioSchema = z
  .object({
    email: emailSchema.optional(),
    name: optionalNullableStringSchema,
    image: optionalNullableStringSchema,
    phoneNumber: optionalNullableStringSchema,
    isActive: optionalBooleanSchema,
    emailVerified: optionalBooleanSchema,
    twoFactorEnabled: optionalBooleanSchema,
    lastLogin: optionalNullableDateSchema,
    roleId: positiveIntSchema.optional(),
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
  })
  .strict();

export const deleteUsuarioSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema> & { id: number };
export type DeleteUsuarioDTO = z.infer<typeof deleteUsuarioSchema>;
