import { Router } from "express";
import {
  createDocumento,
  deleteDocumento,
  getDocumentoById,
  updateDocumento,
} from "../controllers/documento.controller";

const router = Router();

router.get("/:id", getDocumentoById);
router.post("/", createDocumento);
router.patch("/:id", updateDocumento);
router.delete("/:id", deleteDocumento);

export default router;
