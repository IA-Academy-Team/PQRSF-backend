import { Router } from "express";
import {
  createDocumento,
  deleteDocumento,
  getDocumentoById,
  updateDocumento,
} from "../controllers/documento.controller";

const router = Router();

router.get("/:id", getDocumentoById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateDocumento' } } */
  createDocumento
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateDocumento' } } */
  updateDocumento
);
router.delete("/:id", deleteDocumento);

export default router;
