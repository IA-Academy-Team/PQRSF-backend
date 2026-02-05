import { Router } from "express";
import {
  createStakeholder,
  deleteStakeholder,
  getStakeholderById,
  listStakeholders,
  updateStakeholder,
} from "../controllers/stakeholder.controller";

const router = Router();

router.get("/", listStakeholders);
router.get("/:id", getStakeholderById);
router.post(
  "/",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateStakeholder' } } */
  createStakeholder
);
router.put(
  "/:id",
  /* #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateStakeholder' } } */
  updateStakeholder
);
router.delete("/:id", deleteStakeholder);

export default router;
