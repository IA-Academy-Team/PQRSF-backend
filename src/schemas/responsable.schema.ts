import { z } from "zod";
import {
  emailSchema,
  nonEmptyStringSchema,
  optionalNullablePositiveIntSchema,
  optionalNullableStringSchema,
  positiveIntSchema,
} from "./common.schema";

export const createResponsableSchema = z
  .object({
    name: nonEmptyStringSchema,
    email: emailSchema,
    password: nonEmptyStringSchema,
    phoneNumber: nonEmptyStringSchema,
    areaId: optionalNullablePositiveIntSchema,
  })
  .strict();

export const updateResponsableSchema = z
  .object({
    name: optionalNullableStringSchema,
    email: emailSchema.optional(),
    password: optionalNullableStringSchema,
    phoneNumber: optionalNullableStringSchema,
    areaId: optionalNullablePositiveIntSchema,
  })
  .strict();

export const deleteResponsableSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateResponsableDTO = z.infer<typeof createResponsableSchema>;
export type UpdateResponsableDTO = z.infer<typeof updateResponsableSchema> & { id: number };
export type DeleteResponsableDTO = z.infer<typeof deleteResponsableSchema>;
