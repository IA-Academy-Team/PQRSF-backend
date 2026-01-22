import { z } from "zod";
import { emailSchema, nonEmptyStringSchema, optionalStringSchema } from "./common.schema";

export const authRegisterSchema = z
  .object({
    name: optionalStringSchema,
    email: emailSchema,
    password: nonEmptyStringSchema.min(8),
  })
  .strict();

export const authLoginSchema = z
  .object({
    email: emailSchema,
    password: nonEmptyStringSchema.min(1),
  })
  .strict();

export const authRequestResetSchema = z
  .object({
    email: emailSchema,
    redirectTo: optionalStringSchema,
  })
  .strict();

export const authResetSchema = z
  .object({
    token: nonEmptyStringSchema,
    newPassword: nonEmptyStringSchema.min(8),
  })
  .strict();

export type AuthRegisterDTO = z.infer<typeof authRegisterSchema>;
export type AuthLoginDTO = z.infer<typeof authLoginSchema>;
export type AuthRequestResetDTO = z.infer<typeof authRequestResetSchema>;
export type AuthResetDTO = z.infer<typeof authResetSchema>;
