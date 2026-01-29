import { z } from "zod";
import { nonEmptyStringSchema, positiveIntSchema } from "./core/common.schema";

export const createStakeholderSchema = z
  .object({
    name: nonEmptyStringSchema,
  })
  .strict();

export const updateStakeholderSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
  })
  .strict();

export const deleteStakeholderSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateStakeholderDTO = z.infer<typeof createStakeholderSchema>;
export type UpdateStakeholderDTO = z.infer<typeof updateStakeholderSchema> & { id: number };
export type DeleteStakeholderDTO = z.infer<typeof deleteStakeholderSchema>;
