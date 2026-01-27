import { Router } from "express";
import {
  createPqrs,
  deletePqrs,
  getPqrsById,
  listPqrs,
  updatePqrs,
} from "../controllers/pqrs.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreatePqrs' } } */
  createPqrs
);
// UNUSED (frontend)
router.get("/", listPqrs);
// UNUSED (frontend)
router.get("/:id", getPqrsById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdatePqrs' } } */
  updatePqrs
);
// UNUSED (frontend)
router.delete("/:id", deletePqrs);

export default router;
