import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./core/common.schema";

export const createEstadoPqrsSchema = z
  .object({
    name: nonEmptyStringSchema,
  })
  .strict();

export const updateEstadoPqrsSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
  })
  .strict();

export const deleteEstadoPqrsSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateEstadoPqrsDTO = z.infer<typeof createEstadoPqrsSchema>;
export type UpdateEstadoPqrsDTO = z.infer<typeof updateEstadoPqrsSchema> & { id: number };
export type DeleteEstadoPqrsDTO = z.infer<typeof deleteEstadoPqrsSchema>;
