import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getUsuarioByEmail,
  getUsuarioById,
  listUsuarios,
  updateUsuario,
  updateUsuarioStatus,
} from "../controllers/usuario.controller";

const router = Router();

router.get("/", listUsuarios);
router.get("/email/:email", getUsuarioByEmail);
router.get("/:id", getUsuarioById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateUsuario' } } */
  createUsuario
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateUsuario' } } */
  updateUsuario
);
router.patch(
  "/:id/status",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UsuarioStatus' } } */
  updateUsuarioStatus
);
router.delete("/:id", deleteUsuario);

export default router;
