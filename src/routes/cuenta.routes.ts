import { Router } from "express";
import {
  createCuenta,
  deleteCuenta,
  getCuentaById,
  updateCuenta,
} from "../controllers/cuenta.controller";

const router = Router();

router.get("/:id", getCuentaById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateCuenta' } } */
  createCuenta
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateCuenta' } } */
  updateCuenta
);
router.delete("/:id", deleteCuenta);

export default router;
