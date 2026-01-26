import { Router } from "express";
import { updateResponse } from "../controllers/pqrsf.controller";

const router = Router();

router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateRespuesta' } } */
  updateResponse
);

export default router;
