import { z } from "zod";
import {
  optionalDateSchema,
  optionalNullableStringSchema,
  optionalPositiveIntSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createReanalisisSchema = z
  .object({
    answer: optionalNullableStringSchema,
    actionTaken: optionalNullableStringSchema,
    analysisId: positiveIntSchema,
    responsibleId: positiveIntSchema,
  })
  .strict();

export const updateReanalisisSchema = z
  .object({
    answer: optionalNullableStringSchema,
    actionTaken: optionalNullableStringSchema,
    createdAt: optionalDateSchema,
    analysisId: optionalPositiveIntSchema,
    responsibleId: optionalPositiveIntSchema,
  })
  .strict();

export const deleteReanalisisSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateReanalisisDTO = z.infer<typeof createReanalisisSchema>;
export type UpdateReanalisisDTO = z.infer<typeof updateReanalisisSchema> & { id: number };
export type DeleteReanalisisDTO = z.infer<typeof deleteReanalisisSchema>;
