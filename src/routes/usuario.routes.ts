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

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateUsuario' } } */
  createUsuario
);
router.get("/", listUsuarios);
router.get("/:id", getUsuarioById);
router.get("/email/:email", getUsuarioByEmail);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateUsuario' } } */
  updateUsuario
);
router.delete("/:id", deleteUsuario);

export default router;
