import { z } from "zod";
import {
  nonEmptyStringSchema,
  optionalDateSchema,
  optionalNullableStringSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createRolSchema = z
  .object({
    name: nonEmptyStringSchema,
    description: optionalNullableStringSchema,
  })
  .strict();

export const updateRolSchema = z
  .object({
    name: nonEmptyStringSchema.optional(),
    description: optionalNullableStringSchema,
    createdAt: optionalDateSchema,
  })
  .strict();

export const deleteRolSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateRolDTO = z.infer<typeof createRolSchema>;
export type UpdateRolDTO = z.infer<typeof updateRolSchema> & { id: number };
export type DeleteRolDTO = z.infer<typeof deleteRolSchema>;
