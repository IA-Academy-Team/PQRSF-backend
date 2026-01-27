import { Router } from "express";
import {
  createAnalisis,
  deleteAnalisis,
  getAnalisisById,
  updateAnalisis,
} from "../controllers/analisis.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAnalisis' } } */
  createAnalisis
);
// UNUSED (frontend)
router.get("/:id", getAnalisisById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateAnalisis' } } */
  updateAnalisis
);
// UNUSED (frontend)
router.delete("/:id", deleteAnalisis);

export default router;
