import { Router } from "express";
import {
  createCliente,
  deleteCliente,
  getClienteById,
  updateCliente,
  listClientes
} from "../controllers/cliente.controller";

const router = Router();

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateCliente' } } */
  createCliente
);
router.get("/", listClientes);
router.get("/:id", getClienteById);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateCliente' } } */
  updateCliente
);
router.delete("/:id", deleteCliente);

export default router;
