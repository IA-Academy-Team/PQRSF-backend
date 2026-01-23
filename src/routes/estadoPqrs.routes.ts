import { Router } from "express";
import {
  createEstadoPqrs,
  deleteEstadoPqrs,
  getEstadoPqrsById,
  listEstadoPqrs,
  updateEstadoPqrs,
} from "../controllers/estadoPqrs.controller";

const router = Router();

router.get("/", listEstadoPqrs);
router.get("/:id", getEstadoPqrsById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateEstadoPqrs' } } */
  createEstadoPqrs
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateEstadoPqrs' } } */
  updateEstadoPqrs
);
router.delete("/:id", deleteEstadoPqrs);

export default router;
