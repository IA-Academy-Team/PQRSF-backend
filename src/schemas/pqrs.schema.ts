import { z } from "zod";
import {
  optionalDateSchema,
  nonEmptyStringSchema,
  optionalBooleanSchema,
  optionalNullableDateSchema,
  optionalPositiveIntSchema,
  optionalPositiveBigIntSchema,
  positiveBigIntSchema,
  positiveIntSchema,
} from "./core/common.schema";

export const createPqrsSchema = z
  .object({
    ticketNumber: nonEmptyStringSchema.optional(),
    isAutoResolved: optionalBooleanSchema,
    dueDate: optionalNullableDateSchema,
    pqrsStatusId: optionalPositiveIntSchema,
    clientId: positiveBigIntSchema,
    typePqrsId: positiveIntSchema,
    areaId: positiveIntSchema,
  })
  .strict();

export const updatePqrsSchema = z
  .object({
    ticketNumber: nonEmptyStringSchema.optional(),
    isAutoResolved: optionalBooleanSchema,
    dueDate: optionalNullableDateSchema,
    pqrsStatusId: optionalPositiveIntSchema,
    clientId: positiveBigIntSchema.optional(),
    typePqrsId: positiveIntSchema.optional(),
    areaId: positiveIntSchema.optional(),
    createdAt: optionalDateSchema,
    updatedAt: optionalDateSchema,
  })
  .strict();

export const deletePqrsSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export const pqrsListQuerySchema = z
  .object({
    pqrsStatusId: optionalPositiveIntSchema,
    areaId: optionalPositiveIntSchema,
    typePqrsId: optionalPositiveIntSchema,
    clientId: optionalPositiveBigIntSchema,
    ticketNumber: nonEmptyStringSchema.optional(),
    fromDate: optionalDateSchema,
    toDate: optionalDateSchema,
  })
  .strict();

export type CreatePqrsDTO = z.infer<typeof createPqrsSchema>;
export type UpdatePqrsDTO = z.infer<typeof updatePqrsSchema> & { id: number };
export type DeletePqrsDTO = z.infer<typeof deletePqrsSchema>;
