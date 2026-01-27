import { Router } from "express";
import {
  createRespuesta,
  deleteRespuesta,
  getRespuestaById,
  updateRespuesta,
} from "../controllers/respuesta.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateRespuesta' } } */
  createRespuesta
);
// UNUSED (frontend)
router.get("/:id", getRespuestaById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateRespuesta' } } */
  updateRespuesta
);
// UNUSED (frontend)
router.delete("/:id", deleteRespuesta);

export default router;
