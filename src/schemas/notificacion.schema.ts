import { z } from "zod";
import {
  optionalDateSchema,
  nonEmptyStringSchema,
  optionalNullableStringSchema,
  optionalPositiveIntSchema,
  positiveIntSchema,
} from "./common.schema";

export const createNotificacionSchema = z
  .object({
    message: nonEmptyStringSchema,
    status: optionalPositiveIntSchema,
    responsibleId: positiveIntSchema,
    pqrsId: positiveIntSchema,
  })
  .strict();

export const updateNotificacionSchema = z
  .object({
    message: optionalNullableStringSchema,
    status: optionalPositiveIntSchema,
    responsibleId: optionalPositiveIntSchema,
    pqrsId: optionalPositiveIntSchema,
    createdAt: optionalDateSchema,
  })
  .strict();

export const markNotificacionesAsReadSchema = z
  .object({
    ids: z.array(positiveIntSchema).min(1),
  })
  .strict();

export const deleteNotificacionSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export const notificacionListQuerySchema = z
  .object({
    responsibleId: positiveIntSchema,
  })
  .strict();

export const notificacionResponsibleParamSchema = z
  .object({
    responsibleId: positiveIntSchema,
  })
  .strict();

export type CreateNotificacionDTO = z.infer<typeof createNotificacionSchema>;
export type UpdateNotificacionDTO = z.infer<typeof updateNotificacionSchema> & { id: number };
export type DeleteNotificacionDTO = z.infer<typeof deleteNotificacionSchema>;
