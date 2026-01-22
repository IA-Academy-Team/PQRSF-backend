import { Router } from "express";
import {
  createRespuesta,
  deleteRespuesta,
  getRespuestaById,
  updateRespuesta,
} from "../controllers/respuesta.controller";

const router = Router();

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateRespuesta' } } */
  createRespuesta
);
router.get("/:id", getRespuestaById);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateRespuesta' } } */
  updateRespuesta
);
router.delete("/:id", deleteRespuesta);

export default router;
