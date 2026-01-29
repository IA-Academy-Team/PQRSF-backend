import { Router } from "express";
import {
  createStakeholder,
  deleteStakeholder,
  getStakeholderById,
  listStakeholders,
  updateStakeholder,
} from "../controllers/stakeholder.controller";

const router = Router();

// UNUSED (frontend)
router.get("/", listStakeholders);
// UNUSED (frontend)
router.get("/:id", getStakeholderById);
// UNUSED (frontend)
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateStakeholder' } } */
  createStakeholder
);
// UNUSED (frontend)
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateStakeholder' } } */
  updateStakeholder
);
// UNUSED (frontend)
router.delete("/:id", deleteStakeholder);

export default router;
