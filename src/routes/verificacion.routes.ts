import { Router } from "express";
import {
  createVerificacion,
  deleteVerificacion,
  getVerificacionById,
  updateVerificacion,
} from "../controllers/verificacion.controller";

const router = Router();

router.get("/:id", getVerificacionById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateVerificacion' } } */
  createVerificacion
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateVerificacion' } } */
  updateVerificacion
);
router.delete("/:id", deleteVerificacion);

export default router;
