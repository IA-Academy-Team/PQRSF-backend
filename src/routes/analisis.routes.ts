import { Router } from "express";
import {
  createAnalisis,
  deleteAnalisis,
  getAnalisisById,
  updateAnalisis,
} from "../controllers/analisis.controller";

const router = Router();

router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAnalisis' } } */
  createAnalisis
);
router.get("/:id", getAnalisisById);
router.patch(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateAnalisis' } } */
  updateAnalisis
);
router.delete("/:id", deleteAnalisis);

export default router;
