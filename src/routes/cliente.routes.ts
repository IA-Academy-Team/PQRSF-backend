import { Router } from "express";
import {
  createCliente,
  deleteCliente,
  getClienteById,
  updateCliente,
  listClientes
} from "../controllers/cliente.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateCliente' } } */
  createCliente
);
// UNUSED (frontend)
router.get("/", listClientes);
// UNUSED (frontend)
router.get("/:id", getClienteById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateCliente' } } */
  updateCliente
);
// UNUSED (frontend)
router.delete("/:id", deleteCliente);

export default router;
