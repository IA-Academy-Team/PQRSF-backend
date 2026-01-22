import { Router } from "express";
import {
  createCliente,
  deleteCliente,
  getClienteById,
  updateCliente,
} from "../controllers/cliente.controller";

const router = Router();

router.get("/:id", getClienteById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateCliente' } } */
  createCliente
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateCliente' } } */
  updateCliente
);
router.delete("/:id", deleteCliente);

export default router;
