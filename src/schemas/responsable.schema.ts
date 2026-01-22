import { z } from "zod";
import { optionalNullablePositiveIntSchema, positiveIntSchema } from "./common.schema";

export const createResponsableSchema = z
  .object({
    userId: positiveIntSchema,
    areaId: optionalNullablePositiveIntSchema,
  })
  .strict();

export const updateResponsableSchema = z
  .object({
    userId: positiveIntSchema.optional(),
    areaId: optionalNullablePositiveIntSchema,
  })
  .strict();

export const deleteResponsableSchema = z
  .object({
    id: positiveIntSchema,
  })
  .strict();

export type CreateResponsableDTO = z.infer<typeof createResponsableSchema>;
export type UpdateResponsableDTO = z.infer<typeof updateResponsableSchema> & { id: number };
export type DeleteResponsableDTO = z.infer<typeof deleteResponsableSchema>;
