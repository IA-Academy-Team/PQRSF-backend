import { Router } from "express";
import {
  createResponsable,
  deleteResponsable,
  getResponsableByUserId,
  getResponsableById,
  updateResponsable,
  getAllResponsables
} from "../controllers/responsable.controller";

const router = Router();

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateResponsable' } } */
  createResponsable
);
router.get("/user/:userId", getResponsableByUserId);
router.get("/:id", getResponsableById);
router.get("/", getAllResponsables);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateResponsable' } } */
  updateResponsable
);
router.delete("/:id", deleteResponsable);

export default router;
