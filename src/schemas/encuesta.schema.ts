import { z } from "zod";
import {
  optionalDateSchema,
  optionalNullableStringSchema,
  optionalPositiveIntSchema,
  positiveIntSchema,
} from "./core/common.schema";

const scoreSchema = z.coerce.number().int().min(1).max(5);
const optionalNullableScoreSchema = scoreSchema.nullable().optional();

export const createEncuestaSchema = z
  .object({
    q1Clarity: optionalNullableScoreSchema,
    q2Timeliness: optionalNullableScoreSchema,
    q3Quality: optionalNullableScoreSchema,
    q4Attention: optionalNullableScoreSchema,
    q5Overall: optionalNullableScoreSchema,
    comment: optionalNullableStringSchema,
    pqrsId: positiveIntSchema,
  })
  .strict();

export const createPublicEncuestaSchema = z
  .object({
    q1Clarity: optionalNullableScoreSchema,
    q2Timeliness: optionalNullableScoreSchema,
    q3Quality: optionalNullableScoreSchema,
    q4Attention: optionalNullableScoreSchema,
    q5Overall: optionalNullableScoreSchema,
    comment: optionalNullableStringSchema,
  })
  .strict();

export const updateEncuestaSchema = z
  .object({
    q1Clarity: optionalNullableScoreSchema,
    q2Timeliness: optionalNullableScoreSchema,
    q3Quality: optionalNullableScoreSchema,
    q4Attention: optionalNullableScoreSchema,
    q5Overall: optionalNullableScoreSchema,
    comment: optionalNullableStringSchema,
    pqrsId: optionalPositiveIntSchema,
    createdAt: optionalDateSchema,
  })
  .strict();

export const deleteEncuestaSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateEncuestaDTO = z.infer<typeof createEncuestaSchema>;
export type CreatePublicEncuestaDTO = z.infer<typeof createPublicEncuestaSchema>;
export type UpdateEncuestaDTO = z.infer<typeof updateEncuestaSchema> & { id: number };
export type DeleteEncuestaDTO = z.infer<typeof deleteEncuestaSchema>;
