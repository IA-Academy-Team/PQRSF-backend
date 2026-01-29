import { Router } from "express";
import {
  createCuenta,
  deleteCuenta,
  getCuentaById,
  updateCuenta,
} from "../controllers/cuenta.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateCuenta' } } */
  createCuenta
);
// UNUSED (frontend)
router.get("/:id", getCuentaById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateCuenta' } } */
  updateCuenta
);
// UNUSED (frontend)
router.delete("/:id", deleteCuenta);

export default router;
