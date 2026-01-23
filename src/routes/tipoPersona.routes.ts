import { Router } from "express";
import {
  createTipoPersona,
  deleteTipoPersona,
  getTipoPersonaById,
  listTipoPersona,
  updateTipoPersona,
} from "../controllers/tipoPersona.controller";

const router = Router();

router.get("/", listTipoPersona);
router.get("/:id", getTipoPersonaById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateTipoPersona' } } */
  createTipoPersona
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateTipoPersona' } } */
  updateTipoPersona
);
router.delete("/:id", deleteTipoPersona);

export default router;
