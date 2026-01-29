import { Router } from "express";
import {
  createDocumento,
  deleteDocumento,
  getDocumentoById,
  updateDocumento,
} from "../controllers/documento.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateDocumento' } } */
  createDocumento
);
// UNUSED (frontend)
router.get("/:id", getDocumentoById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateDocumento' } } */
  updateDocumento
);
// UNUSED (frontend)
router.delete("/:id", deleteDocumento);

export default router;
