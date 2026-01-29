import { Router } from "express";
import {
  createTipoDocumento,
  deleteTipoDocumento,
  getTipoDocumentoById,
  listTipoDocumento,
  updateTipoDocumento,
} from "../controllers/tipoDocumento.controller";

const router = Router();

router.get("/", listTipoDocumento);
router.get("/:id", getTipoDocumentoById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateTipoDocumento' } } */
  createTipoDocumento
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateTipoDocumento' } } */
  updateTipoDocumento
);
router.delete("/:id", deleteTipoDocumento);

export default router;
