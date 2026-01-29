import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./core/common.schema";

export const createTipoPqrsSchema = z
  .object({
    name: nonEmptyStringSchema,
  })
  .strict();

export const updateTipoPqrsSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
  })
  .strict();

export const deleteTipoPqrsSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateTipoPqrsDTO = z.infer<typeof createTipoPqrsSchema>;
export type UpdateTipoPqrsDTO = z.infer<typeof updateTipoPqrsSchema> & { id: number };
export type DeleteTipoPqrsDTO = z.infer<typeof deleteTipoPqrsSchema>;
