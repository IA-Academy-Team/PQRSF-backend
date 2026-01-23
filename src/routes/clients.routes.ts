import { Router } from "express";
import { listClientes } from "../controllers/cliente.controller";

const router = Router();

router.get("/", listClientes);

export default router;
