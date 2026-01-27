import { Router } from "express";
import {
  createVerificacion,
  deleteVerificacion,
  getVerificacionById,
  updateVerificacion,
} from "../controllers/verificacion.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateVerificacion' } } */
  createVerificacion
);
// UNUSED (frontend)
router.get("/:id", getVerificacionById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateVerificacion' } } */
  updateVerificacion
);
// UNUSED (frontend)
router.delete("/:id", deleteVerificacion);

export default router;
