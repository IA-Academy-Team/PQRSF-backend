import { z } from "zod";
import { nonEmptyStringSchema, optionalNullableStringSchema, positiveIntSchema } from "./core/common.schema";

export const createAreaSchema = z
  .object({
    name: nonEmptyStringSchema,
    code: optionalNullableStringSchema,
    description: optionalNullableStringSchema,
  })
  .strict();

export const updateAreaSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
    code: optionalNullableStringSchema,
    description: optionalNullableStringSchema,
  })
  .strict();

export const deleteAreaSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateAreaDTO = z.infer<typeof createAreaSchema>;
export type UpdateAreaDTO = z.infer<typeof updateAreaSchema> & { id: number };
export type DeleteAreaDTO = z.infer<typeof deleteAreaSchema>;
