import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getUsuarioByEmail,
  getUsuarioById,
  listUsuarios,
  updateUsuario,
} from "../controllers/usuario.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateUsuario' } } */
  createUsuario
);
// UNUSED (frontend)
router.get("/", listUsuarios);
// UNUSED (frontend)
router.get("/:id", getUsuarioById);
// UNUSED (frontend)
router.get("/email/:email", getUsuarioByEmail);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateUsuario' } } */
  updateUsuario
);
// UNUSED (frontend)
router.delete("/:id", deleteUsuario);

export default router;
