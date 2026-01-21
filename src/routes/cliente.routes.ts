import { Router } from "express";
import {
  createCliente,
  deleteCliente,
  getClienteById,
  updateCliente,
} from "../controllers/cliente.controller";

const router = Router();

router.get("/:id", getClienteById);
router.post("/", createCliente);
router.patch("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
