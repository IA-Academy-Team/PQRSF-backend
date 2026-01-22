import { Router } from "express";
import {
  createPqrs,
  deletePqrs,
  getPqrsById,
  listPqrs,
  updatePqrs,
} from "../controllers/pqrs.controller";

const router = Router();

router.get("/", listPqrs);
router.get("/:id", getPqrsById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreatePqrs' } } */
  createPqrs
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdatePqrs' } } */
  updatePqrs
);
router.delete("/:id", deletePqrs);

export default router;
