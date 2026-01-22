import { Router } from "express";
import {
  createResponsable,
  deleteResponsable,
  getResponsableById,
  updateResponsable,
} from "../controllers/responsable.controller";

const router = Router();

router.get("/:id", getResponsableById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateResponsable' } } */
  createResponsable
);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateResponsable' } } */
  updateResponsable
);
router.delete("/:id", deleteResponsable);

export default router;
