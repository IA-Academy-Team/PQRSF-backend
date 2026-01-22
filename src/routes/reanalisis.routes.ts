import { Router } from "express";
import {
  createReanalisis,
  deleteReanalisis,
  getReanalisisById,
  updateReanalisis,
} from "../controllers/reanalisis.controller";

const router = Router();

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateReanalisis' } } */
  createReanalisis
);
router.get("/:id", getReanalisisById);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateReanalisis' } } */
  updateReanalisis
);
router.delete("/:id", deleteReanalisis);

export default router;
