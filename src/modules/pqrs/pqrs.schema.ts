import { z } from "zod";

export const createPqrsSchema = z.object({
  client_id: z.string().uuid(),
  type_pqrs_id: z.number(),
  area_id: z.number(),
  is_auto_resolved: z.boolean().default(false),
});

export type CreatePqrsDTO = z.infer<typeof createPqrsSchema>;
