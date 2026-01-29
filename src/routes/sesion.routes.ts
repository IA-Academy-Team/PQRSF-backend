import { Router } from "express";
import {
  createSesion,
  deleteSesion,
  getSesionById,
  updateSesion,
} from "../controllers/sesion.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateSesion' } } */
  createSesion
);
// UNUSED (frontend)
router.get("/:id", getSesionById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateSesion' } } */
  updateSesion
);
// UNUSED (frontend)
router.delete("/:id", deleteSesion);

export default router;
