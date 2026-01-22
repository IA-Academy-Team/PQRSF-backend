import { Router } from "express";
import {
  createSesion,
  deleteSesion,
  getSesionById,
  updateSesion,
} from "../controllers/sesion.controller";

const router = Router();

router.get("/:id", getSesionById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateSesion' } } */
  createSesion
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateSesion' } } */
  updateSesion
);
router.delete("/:id", deleteSesion);

export default router;
