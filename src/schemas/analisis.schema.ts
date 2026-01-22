import { z } from "zod";
import {
  optionalDateSchema,
  optionalNullableStringSchema,
  optionalPositiveIntSchema,
  positiveIntSchema,
} from "./common.schema";

export const createAnalisisSchema = z
  .object({
    answer: optionalNullableStringSchema,
    actionTaken: optionalNullableStringSchema,
    pqrsId: positiveIntSchema,
    responsibleId: positiveIntSchema,
  })
  .strict();

export const updateAnalisisSchema = z
  .object({
    answer: optionalNullableStringSchema,
    actionTaken: optionalNullableStringSchema,
    createdAt: optionalDateSchema,
    pqrsId: optionalPositiveIntSchema,
    responsibleId: optionalPositiveIntSchema,
  })
  .strict();

export const deleteAnalisisSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateAnalisisDTO = z.infer<typeof createAnalisisSchema>;
export type UpdateAnalisisDTO = z.infer<typeof updateAnalisisSchema> & { id: number };
export type DeleteAnalisisDTO = z.infer<typeof deleteAnalisisSchema>;
