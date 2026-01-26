import { Router } from "express";
import {
  createTipoPqrs,
  deleteTipoPqrs,
  getTipoPqrsById,
  listTipoPqrs,
  updateTipoPqrs,
} from "../controllers/tipoPqrs.controller";

const router = Router();

router.get("/", listTipoPqrs);
router.get("/:id", getTipoPqrsById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateTipoPqrs' } } */
  createTipoPqrs
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateTipoPqrs' } } */
  updateTipoPqrs
);
router.delete("/:id", deleteTipoPqrs);

export default router;
