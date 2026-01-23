import { Router } from "express";
import {
  getUsuarioByEmail,
  updateUsuarioStatus,
} from "../controllers/usuario.controller";

const router = Router();

router.get("/email/:email", getUsuarioByEmail);
router.patch(
  "/:id/status",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UsuarioStatus' } } */
  updateUsuarioStatus
);

export default router;
