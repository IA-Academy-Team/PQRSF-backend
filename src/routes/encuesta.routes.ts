import { Router } from "express";
import {
  createEncuesta,
  deleteEncuesta,
  getEncuestaById,
  updateEncuesta,
} from "../controllers/encuesta.controller";

const router = Router();

router.get("/:id", getEncuestaById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEncuesta' } } */
  createEncuesta
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateEncuesta' } } */
  updateEncuesta
);
router.delete("/:id", deleteEncuesta);

export default router;
