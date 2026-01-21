import { Router } from "express";
import {
  createCuenta,
  deleteCuenta,
  getCuentaById,
  updateCuenta,
} from "../controllers/cuenta.controller";

const router = Router();

router.get("/:id", getCuentaById);
router.post("/", createCuenta);
router.patch("/:id", updateCuenta);
router.delete("/:id", deleteCuenta);

export default router;
