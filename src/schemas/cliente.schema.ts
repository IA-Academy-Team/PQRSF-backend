import { z } from "zod";
import {
  optionalNullableEmailSchema,
  optionalNullablePositiveIntSchema,
  optionalNullableStringSchema,
  positiveBigIntSchema,
} from "./core/common.schema";

export const createClienteSchema = z
  .object({
    id: positiveBigIntSchema,
    name: optionalNullableStringSchema,
    document: optionalNullableStringSchema,
    email: optionalNullableEmailSchema,
    phoneNumber: optionalNullableStringSchema,
    typePersonId: optionalNullablePositiveIntSchema,
    stakeholderId: optionalNullablePositiveIntSchema,
  })
  .strict()
  .refine((data) => data.email || data.phoneNumber, {
    message: "Either email or phoneNumber is required",
    path: ["email"],
  });

export const updateClienteSchema = z
  .object({
    name: optionalNullableStringSchema,
    document: optionalNullableStringSchema,
    email: optionalNullableEmailSchema,
    phoneNumber: optionalNullableStringSchema,
    typePersonId: optionalNullablePositiveIntSchema,
    stakeholderId: optionalNullablePositiveIntSchema,
  })
  .strict();

export const deleteClienteSchema = z
  .object({
    id: positiveBigIntSchema,
  })
  .strict();

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema> & { id: bigint };
export type DeleteClienteDTO = z.infer<typeof deleteClienteSchema>;
