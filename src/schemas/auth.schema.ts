import { z } from "zod";
import { emailSchema, nonEmptyStringSchema, optionalStringSchema } from "./core/common.schema";

export const authRegisterSchema = z
  .object({
    name: optionalStringSchema,
    email: emailSchema,
    password: nonEmptyStringSchema.min(8),
    phoneNumber: optionalStringSchema,
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

export const authRefreshSchema = z
  .object({
    providerId: nonEmptyStringSchema,
    accountId: optionalStringSchema,
    userId: optionalStringSchema,
  })
  .strict();

export const authVerifyEmailSchema = z
  .object({
    token: nonEmptyStringSchema,
    callbackURL: optionalStringSchema,
  })
  .strict();

export type AuthRegisterDTO = z.infer<typeof authRegisterSchema>;
export type AuthLoginDTO = z.infer<typeof authLoginSchema>;
export type AuthRequestResetDTO = z.infer<typeof authRequestResetSchema>;
export type AuthResetDTO = z.infer<typeof authResetSchema>;
export type AuthRefreshDTO = z.infer<typeof authRefreshSchema>;
export type AuthVerifyEmailDTO = z.infer<typeof authVerifyEmailSchema>;
