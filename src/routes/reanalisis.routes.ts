import { Router } from "express";
import {
  createReanalisis,
  deleteReanalisis,
  getReanalisisById,
  updateReanalisis,
} from "../controllers/reanalisis.controller";

const router = Router();

// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateReanalisis' } } */
  createReanalisis
);
// UNUSED (frontend)
router.get("/:id", getReanalisisById);
// UNUSED (frontend)
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateReanalisis' } } */
  updateReanalisis
);
// UNUSED (frontend)
router.delete("/:id", deleteReanalisis);

export default router;
